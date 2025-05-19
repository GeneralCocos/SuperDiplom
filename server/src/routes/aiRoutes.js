const express = require('express');
const { getAIMove, trainAI, evaluatePosition } = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get AI move for a given position
router.post('/move', getAIMove);

// Train AI with new positions (protected route)
router.post('/train', authenticate, trainAI);

// Evaluate a position
router.post('/evaluate', evaluatePosition);

module.exports = router; 