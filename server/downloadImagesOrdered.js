import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES_JSON_PATH = path.resolve('cloudinary_images.json');
const TARGET_DIR = path.resolve('..', 'downloaded_products_ordered');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const rawData = JSON.parse(fs.readFileSync(IMAGES_JSON_PATH, 'utf8'));
const stationeryImages = rawData
  .filter(img => img.public_id && img.public_id.startsWith('soltane-stationery/'))
  .map(img => {
    const match = img.url.match(/\/v(\d+)\//);
    return {
      ...img,
      version: match ? parseInt(match[1], 10) : 0
    };
  });

// Sort ascending (chronological: oldest upload first -> newest upload last)
stationeryImages.sort((a, b) => a.version - b.version);

// Save an index mapping file so you know exactly which file maps to which URL & timestamp
const indexMapping = stationeryImages.map((img, idx) => {
  const paddedIndex = String(idx + 1).padStart(4, '0');
  const filename = `${paddedIndex}_${path.basename(img.url)}`;
  return {
    index: idx + 1,
    filename,
    uploadTimestamp: img.version,
    uploadDate: new Date(img.version * 1000).toISOString(),
    url: img.url,
    public_id: img.public_id
  };
});

fs.writeFileSync(
  path.join(TARGET_DIR, 'images_index.json'),
  JSON.stringify(indexMapping, null, 2),
  'utf8'
);

console.log(`Prepared ${stationeryImages.length} images sorted chronologically.`);
console.log(`Images index saved to: ${path.join(TARGET_DIR, 'images_index.json')}`);

// Download helper with concurrency
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve(false); // already downloaded
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const CONCURRENCY = 15;
  let active = 0;
  let completed = 0;
  let currentIndex = 0;

  console.log(`Starting download into ${TARGET_DIR} (concurrency: ${CONCURRENCY})...`);

  return new Promise((resolve) => {
    function next() {
      if (completed >= indexMapping.length) {
        console.log(`\nAll ${indexMapping.length} images downloaded successfully!`);
        return resolve();
      }

      while (active < CONCURRENCY && currentIndex < indexMapping.length) {
        const item = indexMapping[currentIndex++];
        const dest = path.join(TARGET_DIR, item.filename);
        active++;

        downloadFile(item.url, dest)
          .then((downloaded) => {
            active--;
            completed++;
            if (completed % 50 === 0 || completed === indexMapping.length) {
              process.stdout.write(`Downloaded: ${completed}/${indexMapping.length} images...\r`);
            }
            next();
          })
          .catch((err) => {
            active--;
            completed++;
            console.error(`Error downloading ${item.url}:`, err.message);
            next();
          });
      }
    }
    next();
  });
}

run();
