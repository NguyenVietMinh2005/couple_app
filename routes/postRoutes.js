import express from 'express';
import { createPost, getPublicFeed, toggleLikePost, addComment } from '../controllers/postController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/create', protect, createPost);
router.post('/:postId/comment', protect, addComment);
router.put('/:postId/like', protect, toggleLikePost);

router.get('/feed', getPublicFeed);

export default router;