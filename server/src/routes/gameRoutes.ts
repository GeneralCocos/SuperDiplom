import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create a new game
router.post('/create', authenticate, (req, res) => {
  res.json({ message: 'Create game endpoint' });
});

// Join an existing game
router.post('/join/:gameId', authenticate, (req, res) => {
  res.json({ message: 'Join game endpoint' });
});

// Get game state
router.get('/:gameId', authenticate, (req, res) => {
  res.json({ message: 'Get game state endpoint' });
});

// Make a move
router.post('/:gameId/move', authenticate, (req, res) => {
  res.json({ message: 'Make move endpoint' });
});

export default router; 