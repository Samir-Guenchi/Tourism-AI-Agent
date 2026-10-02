const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');

const TARGET_DIR = path.join(__dirname, '..', 'public', 'images', 'culture');

const SEARCH_ITEMS = [
  // Places
  { sub: 'places', name: 'maqam-echahid.webp', query: 'Maqam Echahid Algiers' },
  { sub: 'places', name: 'jardin-hamma.webp', query: 'Jardin d Essai du Hamma' },
  { sub: 'places', name: 'notre-dame-afrique.webp', query: 'Notre Dame d Afrique Algiers' },
  { sub: 'places', name: 'palais-ahmed-bey.webp', query: 'Palais Ahmed Bey Constantine' },
  { sub: 'places', name: 'ghoufi.webp', query: 'Ghoufi Batna' },
  { sub: 'places', name: 'tombeau-chretienne.webp', query: 'Tombeau de la Chretienne Tipaza' },
  { sub: 'places', name: 'tikjda-djurdjura.webp', query: 'Tikjda Djurdjura' },
  { sub: 'places', name: 'tassili-najjer.webp', query: 'Tassili n Ajjer Djanet' },
  { sub: 'places', name: 'erg-admer.webp', query: 'Erg Admer Djanet' },

  // Food
  { sub: 'food', name: 'chorba-frik.webp', query: 'Chorba Frik Algeria' },
  { sub: 'food', name: 'mhadjeb.webp', query: 'Mahjouba Mhadjeb Algeria' },
  { sub: 'food', name: 'makroudh.webp', query: 'Makroudh Algeria' },
  { sub: 'food', name: 'djouzia.webp', query: 'Djouzia Constantine' },
  { sub: 'food', name: 'zviti.webp', query: 'Zviti Batna' },
  { sub: 'food', name: 'poisson-grille.webp', query: 'Grilled fish Mediterranean' },

  // Clothing
  { sub: 'clothing', name: 'hayek-algerois.webp', query: 'Hayek Alger' },
  { sub: 'clothing', name: 'melhfa-chaouia.webp', query: 'Melhfa Chaouia' },
  { sub: 'clothing', name: 'cheche-touareg.webp', query: 'Tagelmust Tuareg' },
  { sub: 'clothing', name: 'bijoux-kabyles.webp', query: 'Bijoux Beni Yenni Kabyle' }
];

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'TexaAppCulture/1.0 (contact@texadz.com)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
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
        'User-Agent': 'TexaAppCulture/1.0 (contact@texadz.com)',
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

async function searchWikiFile(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&format=json`;
  try {
    const data = await httpGetJson(url);
    const pages = data.query?.pages || {};
    for (const page of Object.values(pages)) {
      if (page.imageinfo && page.imageinfo[0]?.url) {
        const u = page.imageinfo[0].url;
        // Avoid tiny icons, pdfs, etc
        if (!u.endsWith('.svg') && !u.endsWith('.pdf')) {
          return u;
        }
      }
    }
  } catch (e) {
    console.error(`Search error for ${query}:`, e.message);
  }
  return null;
}

async function main() {
  for (const item of SEARCH_ITEMS) {
    const outPath = path.join(TARGET_DIR, item.sub, item.name);
    if (fs.existsSync(outPath)) {
      console.log(`Already exists: ${item.name}`);
      continue;
    }
    console.log(`Searching for: ${item.query}...`);
    const fileUrl = await searchWikiFile(item.query);
    if (!fileUrl) {
      console.log(`No result for ${item.query}`);
      continue;
    }
    console.log(`Downloading ${fileUrl} -> ${item.name}...`);
    try {
      const buf = await fetchBuffer(fileUrl);
      await sharp(buf)
        .resize({ width: 900, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
      console.log(`Saved: ${outPath} (${fs.statSync(outPath).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
    // Small delay to be respectful to Wikimedia
    await new Promise(r => setTimeout(r, 600));
  }
  console.log('Finished culture image download!');
}

main();
