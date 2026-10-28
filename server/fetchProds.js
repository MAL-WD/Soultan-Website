import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Product from './models/Product.js';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const keywords = ['كراس', 'دفتر', 'سيالة', 'قلم', 'غلاف', 'مبراة', 'ممحاة', 'مسطرة', 'ملونة', 'عجينة', 'ورق', 'حاسبة', 'مائية', 'لباد', 'غراء', 'كوس', 'منقلة', 'مدور', 'حافظة', 'لوحة', 'ممسحة'];
  let regexStr = keywords.join('|');
  const products = await Product.find({ name_ar: new RegExp(regexStr, 'i') }).select('_id name_ar price').lean();
  
  fs.writeFileSync('C:/Users/MON-PC/.gemini/antigravity/brain/18754a3c-b67d-405d-9350-a89b429cd3a6/scratch/available_products.json', JSON.stringify(products, null, 2), 'utf8');
  console.log('Saved ' + products.length + ' products to JSON');
  process.exit(0);
});
