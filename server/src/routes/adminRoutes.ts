import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Admin routes
router.get('/users', authenticate, async (req, res) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', authenticate, async (req, res) => {
  try {
    // Add your stats logic here
    res.json({ message: 'Admin stats route' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/role', authenticate, async (req, res) => {
  try {
    await userController.updateUserRole(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 