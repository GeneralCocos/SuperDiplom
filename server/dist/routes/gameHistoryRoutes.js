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
const express_1 = require("express");
const GameHistory_1 = require("../models/GameHistory");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Save game history
router.post('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { whitePlayer, blackPlayer, moves, result, gameType, startTime, endTime, timeControl } = req.body;
        const gameHistory = new GameHistory_1.GameHistory({
            whitePlayer,
            blackPlayer,
            moves,
            result,
            gameType,
            startTime,
            endTime,
            timeControl
        });
        yield gameHistory.save();
        res.status(201).json(gameHistory);
    }
    catch (error) {
        res.status(500).json({ message: 'Ошибка при сохранении истории игры' });
    }
}));
// Get user's game history
router.get('/user/:userId', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const games = yield GameHistory_1.GameHistory.find({
            $or: [{ whitePlayer: userId }, { blackPlayer: userId }]
        })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate('whitePlayer', 'username')
            .populate('blackPlayer', 'username');
        const total = yield GameHistory_1.GameHistory.countDocuments({
            $or: [{ whitePlayer: userId }, { blackPlayer: userId }]
        });
        res.json({
            games,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Ошибка при получении истории игр' });
    }
}));
// Get specific game details
router.get('/:gameId', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId } = req.params;
        const game = yield GameHistory_1.GameHistory.findById(gameId)
            .populate('whitePlayer', 'username')
            .populate('blackPlayer', 'username');
        if (!game) {
            return res.status(404).json({ message: 'Игра не найдена' });
        }
        res.json(game);
    }
    catch (error) {
        res.status(500).json({ message: 'Ошибка при получении деталей игры' });
    }
}));
exports.default = router;
