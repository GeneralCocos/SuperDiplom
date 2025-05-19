"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const news_1 = require("../models/news");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Получить все новости
const getAllNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield news_1.News.find().sort({ createdAt: -1 });
        res.json(news);
    }
    catch (error) {
        console.error('Ошибка при получении новостей:', error);
        res.status(500).json({ message: 'Ошибка при получении новостей', error: error.message });
    }
});
// Получить одну новость
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield news_1.News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'Новость не найдена' });
        }
        res.json(news);
    }
    catch (error) {
        console.error('Ошибка при получении новости:', error);
        res.status(500).json({ message: 'Ошибка при получении новости', error: error.message });
    }
});
// Создать новость
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Получены данные для создания новости:', req.body);
        const { title, content, imageUrl, category } = req.body;
        const news = new news_1.News({
            title,
            content,
            imageUrl,
            category,
            author: 'Администратор'
        });
        console.log('Создан объект новости:', news);
        const savedNews = yield news.save();
        console.log('Новость успешно сохранена:', savedNews);
        res.status(201).json(savedNews);
    }
    catch (error) {
        console.error('Подробная ошибка при создании новости:', error);
        res.status(500).json({
            message: 'Ошибка при создании новости',
            error: error.message,
            details: error instanceof Error && 'errors' in error ?
                Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message
                })) : null
        });
    }
});
// Обновить новость
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, imageUrl, category } = req.body;
        const updatedNews = yield news_1.News.findByIdAndUpdate(req.params.id, {
            title,
            content,
            imageUrl,
            category,
            updatedAt: Date.now()
        }, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ message: 'Новость не найдена' });
        }
        res.json(updatedNews);
    }
    catch (error) {
        console.error('Ошибка при обновлении новости:', error);
        res.status(500).json({ message: 'Ошибка при обновлении новости', error: error.message });
    }
});
// Удалить новость
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedNews = yield news_1.News.findByIdAndDelete(req.params.id);
        if (!deletedNews) {
            return res.status(404).json({ message: 'Новость не найдена' });
        }
        res.json({ message: 'Новость успешно удалена' });
    }
    catch (error) {
        console.error('Ошибка при удалении новости:', error);
        res.status(500).json({ message: 'Ошибка при удалении новости', error: error.message });
    }
});
// Маршруты
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', createNews);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);
exports.default = router;
