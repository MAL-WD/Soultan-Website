import express from 'express';
import { register, login, getMe, logout, forgotPassword, resetPassword, googleLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

import { authLimiter } from '../middleware/security.js';

const router = express.Router();

router.use(authLimiter);

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

export default router;
