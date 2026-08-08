import express from 'express';
import {
  getCollections,
  getActiveCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/active', getActiveCollections);          // public
router.route('/')
  .get(protect, admin, getCollections)               // admin
  .post(protect, admin, createCollection);            // admin
router.route('/:id')
  .get(getCollectionById)                            // public
  .put(protect, admin, updateCollection)             // admin
  .delete(protect, admin, deleteCollection);          // admin

export default router;
