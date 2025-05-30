const express = require('express');
const router = express.Router();
const News = require('../models/News');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Получить все новости
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить новость по ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать новость (только для админа)
router.post('/', [auth, adminAuth], async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    const news = new News({
      title,
      content,
      imageUrl,
      author: req.user.id
    });
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить новость (только для админа)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { title, content, imageUrl },
      { new: true }
    );
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить новость (только для админа)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.json({ message: 'Новость удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 