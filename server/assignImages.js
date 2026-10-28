import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function run() {
  const imgs = JSON.parse(fs.readFileSync('D:/Projects/Soltane-Website/project/server/cloudinary_images.json', 'utf8'));
  const soltaneImgs = imgs.filter(i => i.public_id.startsWith('soltane-stationery/'));

  console.log(`Found ${soltaneImgs.length} images from soltane-stationery on Cloudinary.`);

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  const db = conn.connection.db;

  const products = await db.collection('products').find().toArray();
  console.log(`Found ${products.length} products to update in MongoDB.`);

  const bulkOps = products.map((p, idx) => {
    const imgObj = soltaneImgs[idx % soltaneImgs.length];
    return {
      updateOne: {
        filter: { _id: p._id },
        update: {
          $set: {
            images: [
              {
                url: imgObj.url,
                alt_en: p.name_en,
                alt_ar: p.name_ar,
                isMain: true
              }
            ]
          }
        }
      }
    };
  });

  const res = await db.collection('products').bulkWrite(bulkOps);
  console.log(`🎉 Successfully updated ${res.modifiedCount} products with real Cloudinary images!`);
  process.exit(0);
}

run().catch(err => {
  console.error('Error updating images:', err);
  process.exit(1);
});
