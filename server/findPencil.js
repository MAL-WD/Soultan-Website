import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const products = await Product.find({ 
    $or: [
      { name_ar: /pencil/i },
      { name_en: /pencil/i },
      { name_fr: /pencil/i },
      { name_ar: /HB/i },
      { name_en: /HB/i },
      { name_fr: /HB/i }
    ]
  }).select('_id name_ar name_en name_fr price').lean();
  
  console.log('Found: ' + products.length);
  products.forEach(p => console.log(`[${p._id}] AR: ${p.name_ar} | EN: ${p.name_en} | FR: ${p.name_fr} - ${p.price} DA`));
  process.exit(0);
});
