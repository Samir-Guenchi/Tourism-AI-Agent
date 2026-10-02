const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');

const DATA_DIR = path.join(__dirname, '..', 'src', 'lib');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

const CATEGORIES = [
  { file: 'destinations-data.ts', dir: 'destinations' },
  { file: 'hotels-data.ts', dir: 'hotels' },
  { file: 'restaurants-data.ts', dir: 'restaurants' },
  { file: 'cars-data.ts', dir: 'cars' },
  { file: 'activities-data.ts', dir: 'activities' }
];

for (const cat of CATEGORIES) {
  fs.mkdirSync(path.join(IMAGES_DIR, cat.dir), { recursive: true });
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'TexaAlgeriaTravelApp/1.0 (https://texadz.com; contact@texadz.com)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function fetchBuffer(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'TexaAlgeriaTravelApp/1.0 (https://texadz.com; contact@texadz.com)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, parsedUrl.origin).href;
        }
        return resolve(fetchBuffer(redirectUrl, maxRedirects - 1));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Extract filename from Special:Redirect/file/FILENAME
function extractWikiFileName(url) {
  const match = url.match(/Special:Redirect\/file\/([^?#]+)/i);
  if (match) {
    return decodeURIComponent(match[1]);
  }
  return null;
}

// Batch resolve Special:Redirect titles via Wikimedia API
async function resolveWikimediaTitles(fileNames) {
  const mapping = {}; // fileName -> directCdnUrl
  const BATCH_SIZE = 40;

  for (let i = 0; i < fileNames.length; i += BATCH_SIZE) {
    const batch = fileNames.slice(i, i + BATCH_SIZE);
    const titlesParam = batch.map(f => 'File:' + encodeURIComponent(f)).join('|');
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&format=json`;

    try {
      const data = await httpGetJson(apiUrl);
      const pages = data.query?.pages || {};
      for (const page of Object.values(pages)) {
        if (page.imageinfo && page.imageinfo[0]?.url) {
          // Normalize title without "File:"
          const rawTitle = page.title.replace(/^File:/, '');
          mapping[rawTitle] = page.imageinfo[0].url;
        }
      }
    } catch (err) {
      console.error('Batch resolve error:', err.message);
    }
  }

  return mapping;
}

function getSafeFilename(url, index, category) {
  try {
    const u = new URL(url);
    const pathname = decodeURIComponent(u.pathname);
    let base = path.basename(pathname)
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase();
    base = base.replace(/^(3840px|1200px|800px)[\-_]/, '').replace(/\.(jpg|jpeg|png|webp|tif|tiff|gif)$/i, '');
    const safeBase = base.slice(0, 35) || `item_${index}`;
    return `${category}_${index}_${safeBase}.webp`;
  } catch {
    return `${category}_${index}.webp`;
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('🚀 Phase 2: Resolving and downloading all images with direct CDN URLs...');

  // 1. Gather all remaining external URLs across the data files
  const externalUrlsByCategory = {};
  const allSpecialRedirects = new Set();

  for (const cat of CATEGORIES) {
    const filePath = path.join(DATA_DIR, cat.file);
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/https?:\/\/[^"'`\s,]+/g) || [];
    externalUrlsByCategory[cat.dir] = [...new Set(matches)];

    for (const url of externalUrlsByCategory[cat.dir]) {
      const fn = extractWikiFileName(url);
      if (fn) allSpecialRedirects.add(fn);
    }
  }

  console.log(`Found ${allSpecialRedirects.size} Special:Redirect files. Resolving via Wikimedia API...`);
  const resolvedDirectUrls = await resolveWikimediaTitles([...allSpecialRedirects]);
  console.log(`Successfully resolved ${Object.keys(resolvedDirectUrls).length} direct CDN URLs!`);

  const urlMapping = {};
  let totalDownloaded = 0;
  let totalFailed = 0;

  for (const cat of CATEGORIES) {
    const urls = externalUrlsByCategory[cat.dir] || [];
    console.log(`\n📁 Processing ${cat.file} (${urls.length} external URLs)`);

    for (let i = 0; i < urls.length; i++) {
      const originalUrl = urls[i];
      const fn = extractWikiFileName(originalUrl);
      let downloadUrl = originalUrl;

      if (fn && resolvedDirectUrls[fn]) {
        downloadUrl = resolvedDirectUrls[fn];
      }

      const filename = getSafeFilename(downloadUrl, i + 1, cat.dir);
      const outPath = path.join(IMAGES_DIR, cat.dir, filename);
      const localRelPath = `/images/${cat.dir}/${filename}`;

      // If already downloaded and valid
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
        urlMapping[originalUrl] = localRelPath;
        console.log(`  [ALREADY DOWNLOADED] ${localRelPath}`);
        continue;
      }

      try {
        console.log(`  [${i + 1}/${urls.length}] Downloading: ${downloadUrl.slice(0, 65)}...`);
        const buffer = await fetchBuffer(downloadUrl);

        await sharp(buffer)
          .resize({ width: 1200, height: 800, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(outPath);

        const stats = fs.statSync(outPath);
        urlMapping[originalUrl] = localRelPath;
        totalDownloaded++;
        console.log(`  ✅ Saved ${localRelPath} (${Math.round(stats.size / 1024)} KB)`);
        await sleep(150); // Friendly rate limit to avoid any CDN throttling
      } catch (err) {
        totalFailed++;
        console.error(`  ❌ Failed: ${downloadUrl.slice(0, 50)} -> ${err.message}`);
      }
    }
  }

  console.log(`\n🎉 Downloads complete! Success: ${totalDownloaded}, Failed: ${totalFailed}`);
  console.log(`Total URLs mapped: ${Object.keys(urlMapping).length}`);

  // Replace all mapped URLs in data files
  console.log('\n📝 Updating data files with local /images paths...');
  for (const cat of CATEGORIES) {
    const filePath = path.join(DATA_DIR, cat.file);
    let content = fs.readFileSync(filePath, 'utf8');
    let replaced = 0;

    for (const [origUrl, localPath] of Object.entries(urlMapping)) {
      if (content.includes(origUrl)) {
        content = content.split(origUrl).join(localPath);
        replaced++;
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated ${cat.file}: replaced ${replaced} URLs.`);
  }

  console.log('\n✨ All data files have been updated with local optimized images!');
}

main().catch(console.error);
