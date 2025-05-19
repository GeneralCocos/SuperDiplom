import { Router, Request, Response } from 'express';
import { isAdmin } from '../middleware/auth';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// User management routes
router.get('/users', isAdmin, async (req: Request, res: Response) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

router.put('/users/:id/role', isAdmin, async (req: Request, res: Response) => {
  try {
    await userController.updateUserRole(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

export default router; 