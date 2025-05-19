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
exports.UserController = void 0;
const User_1 = require("../models/User");
class UserController {
    // Получение профиля пользователя
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(401).json({ message: 'Не авторизован' });
                }
                const user = yield User_1.User.findById(req.user.id).select('-password');
                if (!user) {
                    return res.status(404).json({ message: 'Пользователь не найден' });
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json({ message: 'Ошибка сервера' });
            }
        });
    }
    // Обновление профиля пользователя
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(401).json({ message: 'Не авторизован' });
                }
                const user = yield User_1.User.findById(req.user.id);
                if (!user) {
                    return res.status(404).json({ message: 'Пользователь не найден' });
                }
                const { username, email } = req.body;
                user.username = username || user.username;
                user.email = email || user.email;
                yield user.save();
                res.json(user);
            }
            catch (error) {
                res.status(500).json({ message: 'Ошибка при обновлении профиля' });
            }
        });
    }
    // Получение всех пользователей (для админа)
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.User.find().select('-password');
                res.json(users);
            }
            catch (error) {
                res.status(500).json({ message: 'Ошибка при получении списка пользователей' });
            }
        });
    }
    // Обновление роли пользователя (для админа)
    updateUserRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { role } = req.body;
                if (!['user', 'admin'].includes(role)) {
                    return res.status(400).json({ message: 'Недопустимая роль пользователя' });
                }
                const user = yield User_1.User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
                if (!user) {
                    return res.status(404).json({ message: 'Пользователь не найден' });
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json({ message: 'Ошибка при обновлении роли пользователя' });
            }
        });
    }
}
exports.UserController = UserController;
