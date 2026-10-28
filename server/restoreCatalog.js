import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import { parentCategories, subcategoriesData } from './data/categories.js';
import connectDB from './config/db.js';

dotenv.config();

const restoreCatalog = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas.');

    // 1. Get or create admin user for the products
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.findOne();
    }
    const adminId = admin ? admin._id : null;
    console.log('Using User ID for products:', adminId);

    // 2. Re-create Categories & Subcategories
    console.log('Creating categories and subcategories...');
    await Category.deleteMany();

    const createdParentCategories = await Category.insertMany(parentCategories);
    console.log(`✅ Created ${createdParentCategories.length} parent categories.`);

    const subcategoriesToInsert = subcategoriesData.map((sub) => {
      const parent = createdParentCategories.find((p) => p.slug === sub.parentSlug);
      if (!parent) return null;
      const { parentSlug, ...subData } = sub;
      return { ...subData, parent: parent._id };
    }).filter(Boolean);

    const createdSubcategories = await Category.insertMany(subcategoriesToInsert);
    console.log(`✅ Created ${createdSubcategories.length} subcategories.`);

    const allCategories = [...createdParentCategories, ...createdSubcategories];
    
    // Quick category lookup helpers
    const catBySlug = {};
    allCategories.forEach(c => { catBySlug[c.slug] = c._id; });

    const articlesCatId = catBySlug['articles'] || allCategories[0]._id;
    const booksCatId = catBySlug['books'] || articlesCatId;
    const bagsCatId = catBySlug['bags'] || articlesCatId;
    const techCatId = catBySlug['tech'] || articlesCatId;

    // 3. Load Translated Products
    const translatedProducts = JSON.parse(
      fs.readFileSync('D:/Projects/Soltane-Website/project/server/translated_products.json', 'utf8')
    );
    console.log(`Found ${translatedProducts.length} products to insert.`);

    // 4. Map products to categories based on keywords
    const productsToInsert = translatedProducts.map((p) => {
      const name = p.name_ar || '';
      let assignedCategory = articlesCatId;

      if (name.includes('كتاب') || name.includes('مصحف') || name.includes('المراجعة') || name.includes('رواية')) {
        assignedCategory = booksCatId;
      } else if (name.includes('محفظة') || name.includes('حقيبة') || name.includes('مقلمة')) {
        assignedCategory = bagsCatId;
      } else if (name.includes('حاسبة') || name.includes('فأرة') || name.includes('لوحة مفاتيح') || name.includes('سماعة')) {
        assignedCategory = techCatId;
      } else {
        assignedCategory = articlesCatId;
      }

      // Default clean placeholder image
      const placeholderImg = {
        url: 'https://res.cloudinary.com/dv9htf53o/image/upload/v1718000000/placeholder-stationery.png',
        alt_en: p.name_en,
        alt_ar: p.name_ar,
        isMain: true
      };

      return {
        _id: new mongoose.Types.ObjectId(p.id),
        name_en: p.name_en || p.name_ar,
        name_ar: p.name_ar,
        name_fr: p.name_fr || p.name_ar,
        description_en: `High quality ${p.name_en}. Perfect for school, office, and personal stationery needs.`,
        description_ar: `${p.name_ar} عالي الجودة متوفر لدى مكتبة سلطان لجميع المستلزمات المدرسية والمكتبية.`,
        description_fr: `${p.name_fr} de haute qualité. Idéal pour les fournitures scolaires et de bureau.`,
        price: p.price || 0,
        category: assignedCategory,
        stock: 50,
        isActive: true,
        featured: false,
        images: [placeholderImg],
        user: adminId
      };
    });

    // 5. Clear old products & insert new ones
    await Product.deleteMany();
    const inserted = await Product.insertMany(productsToInsert);
    console.log(`🎉 Successfully restored ${inserted.length} products with Arabic, English, and French translations!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during restoration:', error);
    process.exit(1);
  }
};

restoreCatalog();
