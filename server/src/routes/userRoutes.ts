import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { User } from '../models/User';

const router = Router();
const userController = new UserController();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    // Создаем директорию, если она не существует
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Фильтр для проверки типа файла
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения разрешены'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Маршруты для профиля пользователя
router.get('/profile', authenticate, userController.getProfile.bind(userController));
router.put('/profile', authenticate, userController.updateProfile.bind(userController));

// Маршруты для администратора
router.get('/all', authenticate, isAdmin, userController.getAllUsers.bind(userController));
router.put('/:id/role', authenticate, isAdmin, userController.updateUserRole.bind(userController));

// Маршрут для загрузки аватара
router.post('/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Обновляем URL аватара в базе данных
    await User.findByIdAndUpdate(req.user?.id, { avatarUrl });

    res.json({ avatarUrl });
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error);
    res.status(500).json({ message: 'Ошибка при загрузке аватара' });
  }
});

export default router; 