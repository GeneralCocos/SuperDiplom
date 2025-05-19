const News = require('../models/News');

// Получить все новости
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    res.status(500).json({ message: 'Ошибка при получении новостей', error: error.message });
  }
};

// Получить одну новость
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.json(news);
  } catch (error) {
    console.error('Ошибка при получении новости:', error);
    res.status(500).json({ message: 'Ошибка при получении новости', error: error.message });
  }
};

// Создать новость
exports.createNews = async (req, res) => {
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
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
};

// Обновить новость
exports.updateNews = async (req, res) => {
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
    res.status(500).json({ message: 'Ошибка при обновлении новости', error: error.message });
  }
};

// Удалить новость
exports.deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    res.json({ message: 'Новость успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении новости:', error);
    res.status(500).json({ message: 'Ошибка при удалении новости', error: error.message });
  }
}; 