import { Request, Response } from 'express';
import { News } from '../models/news';
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import mongoose from 'mongoose';

const router = Router();

// Получить все новости
const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    res.json(news);
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    res.status(500).json({ message: 'Ошибка при получении новостей', error: (error as Error).message });
  }
};

// Получить одну новость
const getNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'username');
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.json(news);
  } catch (error) {
    console.error('Ошибка при получении новости:', error);
    res.status(500).json({ message: 'Ошибка при получении новости', error: (error as Error).message });
  }
};

// Создать новость (только для админа)
const createNews = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const { title, content, imageUrl, category } = req.body;
    const news = new News({
      title,
      content,
      imageUrl,
      category,
      author: new mongoose.Types.ObjectId(req.user.userId)
    });
    await news.save();
    
    const populatedNews = await News.findById(news._id).populate('author', 'username');
    res.status(201).json(populatedNews);
  } catch (error) {
    console.error('Ошибка при создании новости:', error);
    res.status(500).json({ message: 'Ошибка при создании новости', error: (error as Error).message });
  }
};

// Обновить новость
const updateNews = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const { title, content, imageUrl, category } = req.body;
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        imageUrl,
        category,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('author', 'username');

    if (!updatedNews) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    res.json(updatedNews);
  } catch (error) {
    console.error('Ошибка при обновлении новости:', error);
    res.status(500).json({ message: 'Ошибка при обновлении новости', error: (error as Error).message });
  }
};

// Удалить новость (только для админа)
const deleteNews = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.json({ message: 'Новость удалена' });
  } catch (error) {
    console.error('Ошибка при удалении новости:', error);
    res.status(500).json({ message: 'Ошибка при удалении новости', error: (error as Error).message });
  }
};

// Маршруты
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', [authenticate, isAdmin], createNews);
router.put('/:id', [authenticate, isAdmin], updateNews);
router.delete('/:id', [authenticate, isAdmin], deleteNews);

export default router; 