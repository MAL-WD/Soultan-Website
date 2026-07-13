import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin, detectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(detectUser, createOrder)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

export default router;
