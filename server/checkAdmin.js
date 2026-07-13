import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const checkAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    console.log('Admin User Data:', JSON.stringify(adminUser, null, 2));
    
    if (adminUser) {
      console.log('✅ Admin user found');
      console.log('Role:', adminUser.role);
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
    } else {
      console.log('❌ Admin user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkAdminUser();
