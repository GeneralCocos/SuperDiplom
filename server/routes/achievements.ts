import express from 'express';
import { getAchievements, unlockAchievement, createAchievement } from '../controllers/achievementController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getAchievements);
router.post('/:achievementId/unlock', auth, unlockAchievement);
router.post('/', auth, createAchievement);

export default router; 