// Handle uncaught exceptions first to catch any startup issues
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

import express from 'express';
import dns from 'dns';

// Fix Node 17+ IPv6 routing issues that cause Cloudinary network timeouts
dns.setDefaultResultOrder('ipv4first');

import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import connectDB from './config/db.js';
import logger, { morganStream } from './utils/logger.js';
import {
  apiLimiter,
  helmetSecurity,
  securityHeaders,
  sanitizeInputs
} from './middleware/security.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Trust reverse proxy (important for rate limiting and logging correct client IPs behind proxies)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Middlewares
// 1. Security HTTP Headers & Permissions Policy
app.use(helmetSecurity);
app.use(securityHeaders);

// 2. DDoS & Rate Limiting for all API routes
app.use('/api', apiLimiter);

// 3. Prevent NoSQL Query Injection & HTTP Parameter Pollution
app.use(mongoSanitize());
app.use(hpp());

// 4. Input Sanitization against XSS & script tags
app.use(sanitizeInputs);

// 5. Gzip Compression for payloads
app.use(compression());

// 6. Request Logging through Winston
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: morganStream
}));

// 7. CORS Configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173', 
    'http://localhost:8081', 
    'http://127.0.0.1:8081',
    'http://192.168.1.6:8081',
    'http://192.168.1.6:8082',
    'https://www.soultanstationery.com',
    'https://soultanstationery.com'
  ],
  credentials: true
}));

// 8. Body Parsers with Strict Size Limits against DDoS Payload Floods
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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
import bannerRoutes from './routes/bannerRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';

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
app.use('/api/banners', bannerRoutes);
app.use('/api/collections', collectionRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("🔥 GLOBAL HTTP ERROR:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  });
  
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
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

// Slowloris & HTTP Connection DDoS Protection Timeouts
// Prevents attackers from tying up connection slots with slow headers or idle streams
server.headersTimeout = 65000; // 65 seconds
server.keepAliveTimeout = 61000; // 61 seconds (slightly greater than standard reverse proxy keepalive)
server.requestTimeout = 30000; // 30 seconds max to receive complete client request

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('🔥 UNHANDLED REJECTION! Shutting down...', { error: err.message, stack: err.stack });
  server.close(() => {
    process.exit(1);
  });
});
