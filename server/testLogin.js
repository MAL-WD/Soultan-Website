import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';
import { login } from './controllers/authController.js';

dotenv.config();
connectDB();

const testLogin = async () => {
  try {
    const user = await User.findOne({ email: 'admin@example.com' }).select('+password');
    console.log('Found user:', user.name, 'Role:', user.role);
    
    const isPasswordMatch = await user.comparePassword('123456');
    console.log('Password matches:', isPasswordMatch);
    
    // Simulate what the login controller returns
    console.log('\nWhat login controller would return:');
    console.log({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: 'JWT_TOKEN_HERE',
      },
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testLogin();
