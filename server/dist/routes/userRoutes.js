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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const isAdmin_1 = require("../middleware/isAdmin");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
// Настройка multer для загрузки файлов
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/avatars');
        // Создаем директорию, если она не существует
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Только изображения разрешены'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
// Маршруты для профиля пользователя
router.get('/profile', auth_1.authenticate, userController.getProfile.bind(userController));
router.put('/profile', auth_1.authenticate, userController.updateProfile.bind(userController));
// Маршруты для администратора
router.get('/all', auth_1.authenticate, isAdmin_1.isAdmin, userController.getAllUsers.bind(userController));
router.put('/:id/role', auth_1.authenticate, isAdmin_1.isAdmin, userController.updateUserRole.bind(userController));
// Маршрут для загрузки аватара
router.post('/avatar', auth_1.authenticate, upload.single('avatar'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Файл не был загружен' });
        }
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        // Обновляем URL аватара в базе данных
        yield User_1.User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, { avatarUrl });
        res.json({ avatarUrl });
    }
    catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
        res.status(500).json({ message: 'Ошибка при загрузке аватара' });
    }
}));
exports.default = router;
