import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';

const router = Router();
const userController = new UserController();

// Маршруты для профиля пользователя
router.get('/profile', authenticate, userController.getProfile.bind(userController));
router.put('/profile', authenticate, userController.updateProfile.bind(userController));

// Маршруты для администратора
router.get('/all', authenticate, isAdmin, userController.getAllUsers.bind(userController));
router.put('/:id/role', authenticate, isAdmin, userController.updateUserRole.bind(userController));

export default router; 