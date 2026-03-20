import express from 'express';
import { joinQueue } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js'; // Gọi bảo vệ ra

const router = express.Router();

// POST /api/match/join (Bắt buộc phải có thẻ VIP - Token)
router.post('/join', protect, joinQueue);

export default router;