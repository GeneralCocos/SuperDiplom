import { Router } from 'express';
import { GameHistory } from '../models/GameHistory';
import { authenticate } from '../middleware/auth';

const router = Router();

// Save game history
router.post('/', authenticate, async (req: any, res) => {
  try {
    const {
      whitePlayer,
      blackPlayer,
      moves,
      result,
      gameType,
      startTime,
      endTime,
      timeControl
    } = req.body;

    const gameHistory = new GameHistory({
      whitePlayer,
      blackPlayer,
      moves,
      result,
      gameType,
      startTime,
      endTime,
      timeControl
    });

    await gameHistory.save();
    res.status(201).json(gameHistory);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при сохранении истории игры' });
  }
});

// Get user's game history
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const games = await GameHistory.find({
      $or: [{ whitePlayer: userId }, { blackPlayer: userId }]
    })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('whitePlayer', 'username')
      .populate('blackPlayer', 'username');

    const total = await GameHistory.countDocuments({
      $or: [{ whitePlayer: userId }, { blackPlayer: userId }]
    });

    res.json({
      games,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении истории игр' });
  }
});

// Get specific game details
router.get('/:gameId', authenticate, async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await GameHistory.findById(gameId)
      .populate('whitePlayer', 'username')
      .populate('blackPlayer', 'username');

    if (!game) {
      return res.status(404).json({ message: 'Игра не найдена' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении деталей игры' });
  }
});

export default router; 