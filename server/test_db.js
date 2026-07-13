import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    const uri = process.env.MONGODB_URI;
    console.log(`Connecting to: ${uri}`);
    
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout for quick testing
        });
        console.log('✅ Connection successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:');
        console.error(err);
        process.exit(1);
    }
};

testConnection();
