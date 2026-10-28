import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const results = await Product.find({ name_ar: /لوحة/ }).select('_id name_ar price').lean();
  for (const p of results) console.log('[' + p._id + ']', p.name_ar, '|', p.price, 'DA');
  process.exit(0);
});
