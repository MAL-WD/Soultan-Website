import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function removeEmptyImageProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Count products with empty or no images
    const count = await collection.countDocuments({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null }
      ]
    });

    console.log(`Found ${count} products with no images`);

    // Delete them
    const result = await collection.deleteMany({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null }
      ]
    });

    console.log(`Deleted ${result.deletedCount} products`);

    // Show remaining
    const remaining = await collection.countDocuments();
    console.log(`Remaining products: ${remaining}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

removeEmptyImageProducts();
