import express from 'express';
import {
  initiateDahebiaPayment,
  handleDahebiaWebhook,
  verifyDahebiaPayment,
  getDahebiaPaymentStatus,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Payment initiation and verification routes
router.post('/dahabia/init', protect, initiateDahebiaPayment);
router.post('/dahabia/verify', protect, verifyDahebiaPayment);
router.get('/dahabia/:reference', protect, getDahebiaPaymentStatus);

// Webhook route (public)
router.post('/webhook/dahabia', handleDahebiaWebhook);

export default router;
