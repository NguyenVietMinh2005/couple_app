import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js'; // 1. Gọi bảo vệ

const router = express.Router();

router.post('/send', protect, sendMessage);     // 2. Chặn cửa gửi tin nhắn
router.get('/:coupleId', protect, getMessages); // 3. Chặn cửa xem tin nhắn

export default router;