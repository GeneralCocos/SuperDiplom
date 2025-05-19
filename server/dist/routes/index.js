"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameRoutes_1 = __importDefault(require("./gameRoutes"));
const aiRoutes_1 = __importDefault(require("./aiRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const newsController_1 = __importDefault(require("../controllers/newsController"));
const router = (0, express_1.Router)();
// API маршруты
router.use('/api/games', gameRoutes_1.default);
router.use('/api/ai', aiRoutes_1.default);
router.use('/api/admin', adminRoutes_1.default);
router.use('/api/news', newsController_1.default);
exports.default = router;
