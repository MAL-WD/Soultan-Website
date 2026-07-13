import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import { protect } from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // 2-minute connection timeout
  api_proxy: "", // Ensure no unintended proxy issues
  secure: true,
});

// Configure Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'soltane-stationery', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }], // Optional: resize large images
  },
});

// Init upload with a 5MB file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only jpg, jpeg, png, and webp images are allowed'), false);
    }
  }
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // req.file.path contains the Cloudinary URL
    res.send({
      success: true,
      message: 'Image uploaded',
      filePath: req.file.path,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).send({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

export default router;
