// Handle uncaught exceptions first to catch any startup issues
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});

import express from 'express';
import dns from 'dns';

// Fix Node 17+ IPv6 routing issues that cause Cloudinary network timeouts
dns.setDefaultResultOrder('ipv4first');

import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
// 1. Security HTTP Headers (configured to allow cross-origin resource sharing for static files)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 2. Rate Limiting for API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api', limiter);

// 3. Prevent NoSQL Query Injection
app.use(mongoSanitize());

// 4. Prevent HTTP Parameter Pollution
app.use(hpp());

// 5. Gzip Compression for payloads
app.use(compression());

// 6. Request Logging
app.use(morgan('dev')); 

// 7. CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// 8. Body Parsers
app.use(express.json({ limit: '10kb' })); // limit body size to prevent DDoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Custom Response Logging Middleware (Optional but helpful)
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`[Response] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    return originalSend.apply(res, arguments);
  };
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Soltane Stationery API is running successfully',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL HTTP ERROR:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🔥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  if (err.stack) console.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});
