import express from 'express';
import { pairCouple } from '../controllers/coupleController.js';

const router = express.Router();

// POST /api/couple/pair
router.post('/pair', pairCouple);

export default router;