import express from 'express';
import {
  createCoupon,
  getCoupons,
  getCouponByCode,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/validate', validateCoupon);
router.get('/code/:code', getCouponByCode);

// Admin routes
router.get('/', protect, getCoupons);
router.post('/', protect, createCoupon);
router.put('/:id', protect, updateCoupon);
router.delete('/:id', protect, deleteCoupon);
router.post('/:id/apply', protect, applyCoupon);

export default router;
