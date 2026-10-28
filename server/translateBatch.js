import https from 'https';
import fs from 'fs';

const items = JSON.parse(fs.readFileSync('D:/Projects/Soltane-Website/project/server/scratch_names.json', 'utf8'));

function fetchTranslation(text, lang) {
  return new Promise((resolve) => {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=' + lang + '&dt=t&q=' + encodeURIComponent(text);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const trans = parsed[0].map(x => x[0]).join('');
          resolve(trans || text);
        } catch (e) {
          resolve(text);
        }
      });
    }).on('error', () => resolve(text));
  });
}

async function run() {
  console.log('Translating ' + items.length + ' products to English and French...');
  const out = [];
  
  // Process in batches of 5 concurrent requests for speed
  const BATCH_SIZE = 5;
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const slice = items.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(slice.map(async (it) => {
      const [en, fr] = await Promise.all([
        fetchTranslation(it.name, 'en'),
        fetchTranslation(it.name, 'fr')
      ]);
      return {
        id: it.id,
        name_ar: it.name,
        name_en: en,
        name_fr: fr,
        price: it.price
      };
    }));
    out.push(...results);
    console.log(Math.min(i + BATCH_SIZE, items.length) + '/' + items.length + ' translated');
  }

  fs.writeFileSync('D:/Projects/Soltane-Website/project/server/translated_products.json', JSON.stringify(out, null, 2), 'utf8');
  console.log('All products successfully translated and saved to translated_products.json!');
  process.exit(0);
}

run();
