import express from 'express';
import { ChessAI } from '../ai/chessAI';
import { getAIMove, trainAI, evaluatePosition } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const ai = new ChessAI();

// Get AI move for a given position
router.post('/move', authenticate, getAIMove);

// Train AI with new positions (protected route)
router.post('/train', authenticate, trainAI);

// Evaluate a position
router.post('/evaluate', evaluatePosition);

export default router; 