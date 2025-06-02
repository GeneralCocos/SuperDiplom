import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserController {
  // Получение профиля пользователя
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: 'Не авторизован' });
      }
      
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  // Обновление профиля пользователя
  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: 'Не авторизован' });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      const { username, email } = req.body;
      user.username = username || user.username;
      user.email = email || user.email;

      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при обновлении профиля' });
    }
  }

  // Получение всех пользователей (для админа)
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении списка пользователей' });
    }
  }

  // Обновление роли пользователя (для админа)
  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Недопустимая роль пользователя' });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при обновлении роли пользователя' });
    }
  }
} 