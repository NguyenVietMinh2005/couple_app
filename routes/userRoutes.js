import express from 'express';
import { updateProfile, getMyProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lấy thông tin cá nhân
router.get('/me', protect, getMyProfile);

// Cập nhật thông tin cá nhân
router.put('/profile', protect, updateProfile);


// doi mat khau
router.put('/change-password', protect, changePassword);

export default router;