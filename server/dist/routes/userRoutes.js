"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const isAdmin_1 = require("../middleware/isAdmin");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
// Маршруты для профиля пользователя
router.get('/profile', auth_1.authenticate, userController.getProfile.bind(userController));
router.put('/profile', auth_1.authenticate, userController.updateProfile.bind(userController));
// Маршруты для администратора
router.get('/all', auth_1.authenticate, isAdmin_1.isAdmin, userController.getAllUsers.bind(userController));
router.put('/:id/role', auth_1.authenticate, isAdmin_1.isAdmin, userController.updateUserRole.bind(userController));
exports.default = router;
