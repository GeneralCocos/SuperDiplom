import { Router } from 'express';
import gameRoutes from './gameRoutes';
import aiRoutes from './aiRoutes';
import adminRoutes from './adminRoutes';
import newsRoutes from '../controllers/newsController';

const router = Router();

// API маршруты
router.use('/api/games', gameRoutes);
router.use('/api/ai', aiRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/news', newsRoutes);

export default router; 