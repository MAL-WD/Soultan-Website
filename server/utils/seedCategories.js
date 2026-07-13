import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import { parentCategories, subcategoriesData } from '../data/categories.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedCategories = async () => {
  try {
    await connectDB();

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // First, create parent categories
    const createdParentCategories = await Category.insertMany(parentCategories);
    console.log('✅ Parent categories seeded successfully:');
    createdParentCategories.forEach(cat => {
      console.log(`   - ${cat.name_en} (${cat.name_ar})`);
    });

    // Then, create subcategories with parent references
    const subcategories = subcategoriesData.map(sub => {
      const parent = createdParentCategories.find(p => p.slug === sub.parentSlug);
      if (!parent) {
        console.error(`❌ Parent category not found for subcategory: ${sub.name_en} (parentSlug: ${sub.parentSlug})`);
        return null;
      }
      const { parentSlug, ...subData } = sub;
      return { ...subData, parent: parent._id };
    }).filter(sub => sub !== null);

    const createdSubcategories = await Category.insertMany(subcategories);
    console.log('✅ Subcategories seeded successfully:');
    createdSubcategories.forEach(cat => {
      const parent = createdParentCategories.find(p => p._id.toString() === cat.parent.toString());
      console.log(`   - ${cat.name_en} (${cat.name_ar}) → under ${parent?.name_en || 'Unknown'}`);
    });

    console.log(`\n✅ Total categories seeded: ${createdParentCategories.length} parents + ${createdSubcategories.length} subcategories = ${createdParentCategories.length + createdSubcategories.length} total`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
