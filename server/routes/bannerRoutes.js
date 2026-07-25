import express from 'express';
import {
  getBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/active', getActiveBanners);          // public
router.route('/')
  .get(protect, admin, getBanners)               // admin
  .post(protect, admin, createBanner);            // admin
router.route('/:id')
  .put(protect, admin, updateBanner)             // admin
  .delete(protect, admin, deleteBanner);          // admin

export default router;
