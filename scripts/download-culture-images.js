const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CULTURE_DIR = path.join(PUBLIC_DIR, 'images', 'culture');

const TARGETS = [
  // Food
  { query: 'Kaak algeria pastry', category: 'food', filename: 'kaak-tlemcen.webp' },
  { query: 'Chorba algerian soup', category: 'food', filename: 'chorba-bayda.webp' },
  { query: 'Tajine algerian food', category: 'food', filename: 'tajine-el-kroum.webp' },
  { query: 'Qalb el louz algerian', category: 'food', filename: 'qalb-el-louz.webp' },
  { query: 'Couscous algerien', category: 'food', filename: 'couscous-algerien.webp' },
  { query: 'Rechta algeroise', category: 'food', filename: 'rechta.webp' },
  { query: 'Chakhchoukha biskra', category: 'food', filename: 'chakhchoukha.webp' },
  { query: 'Karantika algeria calentica', category: 'food', filename: 'karantika.webp' },
  { query: 'Makroudh algerie', category: 'food', filename: 'makroudh.webp' },
  { query: 'Doubara biskra', category: 'food', filename: 'doubara.webp' },

  // Places
  { query: 'Lalla Setti Tlemcen', category: 'places', filename: 'lalla-setti.webp' },
  { query: 'Grottes Beni Add Tlemcen', category: 'places', filename: 'grottes-beni-add.webp' },
  { query: 'Mansourah Tlemcen minaret', category: 'places', filename: 'mansourah.webp' },
  { query: 'Sidi Boumediene Tlemcen', category: 'places', filename: 'sidi-boumediene.webp' },
  { query: 'Casbah Algiers', category: 'places', filename: 'casbah-alger.webp' },
  { query: 'Pont Sidi M\'Cid Constantine', category: 'places', filename: 'pont-constantine.webp' },
  { query: 'Fort Santa Cruz Oran', category: 'places', filename: 'santa-cruz-oran.webp' },
  { query: 'Timgad Roman Batna', category: 'places', filename: 'timgad-batna.webp' },
  { query: 'Ghardaia Mzab ksar', category: 'places', filename: 'ghardaia-ksar.webp' },
  { query: 'Gouraya Bejaia cap carbon', category: 'places', filename: 'gouraya-bejaia.webp' },

  // Clothing
  { query: 'Chedda de Tlemcen costume', category: 'clothing', filename: 'chedda-tlemcen.webp' },
  { query: 'Blousa Mensoudj Tlemcen', category: 'clothing', filename: 'blousa-mensoudj.webp' },
  { query: 'Karakou algerois velours', category: 'clothing', filename: 'karakou-algerois.webp' },
  { query: 'Gandoura constantinoise velours', category: 'clothing', filename: 'gandoura-constantinoise.webp' },
  { query: 'Robe kabyle berbere', category: 'clothing', filename: 'robe-kabyle.webp' },
  { query: 'Melhfa chaouia aures', category: 'clothing', filename: 'melhfa-chaouia.webp' },
  { query: 'Touareg tagelmust cheche', category: 'clothing', filename: 'costume-touareg.webp' },
];

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'TexaCultureAssetDownloader/1.0 (https://texadz.com; info@texadz.com)'
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
        'User-Agent': 'TexaCultureAssetDownloader/1.0 (https://texadz.com; info@texadz.com)',
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
        return reject(new Error(`Failed to load ${url}: status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function searchWikimediaImage(query) {
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json`;
  try {
    const data = await httpGetJson(endpoint);
    if (!data.query || !data.query.pages) return null;
    const pages = Object.values(data.query.pages);
    for (const page of pages) {
      if (page.imageinfo && page.imageinfo[0]) {
        const info = page.imageinfo[0];
        const mime = info.mime || '';
        if (mime.startsWith('image/') && !mime.includes('svg') && !mime.includes('tiff')) {
          return info.url;
        }
      }
    }
  } catch (err) {
    console.error(`Error searching Wikimedia for "${query}":`, err.message);
  }
  return null;
}

async function main() {
  console.log(`Starting culture images download (${TARGETS.length} items)...`);
  for (const item of TARGETS) {
    const outDir = path.join(CULTURE_DIR, item.category);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, item.filename);

    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
      console.log(`✓ Exists: ${item.category}/${item.filename}`);
      continue;
    }

    console.log(`Searching for "${item.query}"...`);
    const imgUrl = await searchWikimediaImage(item.query);
    if (!imgUrl) {
      console.log(`✗ No image found on Wikimedia for "${item.query}"`);
      continue;
    }

    console.log(`Downloading from ${imgUrl}...`);
    try {
      const buf = await fetchBuffer(imgUrl);
      const webpBuf = await sharp(buf)
        .resize({ width: 800, height: 600, fit: 'cover', position: 'center' })
        .webp({ quality: 85 })
        .toBuffer();
      fs.writeFileSync(outPath, webpBuf);
      console.log(`✓ Saved: ${item.category}/${item.filename} (${(webpBuf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`✗ Error processing ${item.filename}:`, err.message);
    }
  }
  console.log('Finished culture images download.');
}

main().catch(console.error);
