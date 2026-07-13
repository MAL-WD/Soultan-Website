import express from 'express';
import { getAnalytics, getOrderAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAnalytics);
router.get('/orders', protect, getOrderAnalytics);

export default router;
