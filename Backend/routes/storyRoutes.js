import express from 'express';
import { createStory, getCoupleStories } from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js'; // 1. Gọi bảo vệ

const router = express.Router();

router.post('/create', protect, createStory);        // 2. Chặn cửa đăng Story
router.get('/:coupleId', protect, getCoupleStories); // 3. Chặn cửa xem Story

export default router;