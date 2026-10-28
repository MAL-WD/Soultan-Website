import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  const db = conn.connection.db;

  const res = await db.collection('products').updateMany(
    {},
    {
      $set: {
        images: []
      }
    }
  );
  console.log(`✅ Removed mismatched images from all ${res.modifiedCount} products.`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
