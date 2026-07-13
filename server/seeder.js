import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import { parentCategories, subcategoriesData } from './data/categories.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Category from './models/Category.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        // First, create parent categories
        const createdParentCategories = await Category.insertMany(parentCategories);
        console.log('✅ Parent categories created');

        // Then, create subcategories with parent references
        const subcategories = subcategoriesData.map(sub => {
            const parent = createdParentCategories.find(p => p.slug === sub.parentSlug);
            if (!parent) {
                console.error(`Parent category not found for subcategory: ${sub.name_en} (parentSlug: ${sub.parentSlug})`);
                return null;
            }
            const { parentSlug, ...subData } = sub;
            return { ...subData, parent: parent._id };
        }).filter(sub => sub !== null);

        const createdSubcategories = await Category.insertMany(subcategories);
        console.log('✅ Subcategories created');

        // Combine all categories for product assignment
        const createdCategories = [...createdParentCategories, ...createdSubcategories];

        const sampleProducts = products.map((product) => {
            const category = createdCategories.find((c) => c.slug === product.categorySlug);
            if (!category) {
                console.error(`Category not found for product: ${product.name_en} (slug: ${product.categorySlug})`);
                return null;
            }
            // Remove categorySlug and add category ID
            const { categorySlug, ...productData } = product;
            return { ...productData, user: adminUser, category: category._id };
        }).filter(p => p !== null);

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
