import { Request, Response } from 'express';
import { News } from '../models/news';
import { Router } from 'express';

const router = Router();

// Получить все новости
const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    res.status(500).json({ message: 'Ошибка при получении новостей', error: (error as Error).message });
  }
};

// Получить одну новость
const getNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.json(news);
  } catch (error) {
    console.error('Ошибка при получении новости:', error);
    res.status(500).json({ message: 'Ошибка при получении новости', error: (error as Error).message });
  }
};

// Создать новость
const createNews = async (req: Request, res: Response) => {
  try {
    console.log('Получены данные для создания новости:', req.body);
    
    const { title, content, imageUrl, category } = req.body;
    const news = new News({
      title,
      content,
      imageUrl,
      category,
      author: 'Администратор'
    });

    console.log('Создан объект новости:', news);

    const savedNews = await news.save();
    console.log('Новость успешно сохранена:', savedNews);
    
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Подробная ошибка при создании новости:', error);
    res.status(500).json({ 
      message: 'Ошибка при создании новости', 
      error: (error as Error).message,
      details: error instanceof Error && 'errors' in error ? 
        Object.keys((error as any).errors).map(key => ({
          field: key,
          message: (error as any).errors[key].message
        })) : null
    });
  }
};

// Обновить новость
const updateNews = async (req: Request, res: Response) => {
  try {
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
    );

    if (!updatedNews) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    res.json(updatedNews);
  } catch (error) {
    console.error('Ошибка при обновлении новости:', error);
    res.status(500).json({ message: 'Ошибка при обновлении новости', error: (error as Error).message });
  }
};

// Удалить новость
const deleteNews = async (req: Request, res: Response) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    res.json({ message: 'Новость успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении новости:', error);
    res.status(500).json({ message: 'Ошибка при удалении новости', error: (error as Error).message });
  }
};

// Маршруты
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', createNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

export default router; 