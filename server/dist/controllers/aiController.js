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
exports.evaluatePosition = exports.trainAI = exports.getAIMove = exports.initializeAI = void 0;
const chessAI_1 = require("../ai/chessAI");
const chessAI = new chessAI_1.ChessAI();
const initializeAI = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chessAI.initialize();
        console.log('AI initialized successfully');
    }
    catch (error) {
        console.error('Error initializing AI:', error);
    }
});
exports.initializeAI = initializeAI;
const getAIMove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fen, difficulty } = req.body;
        if (!fen) {
            return res.status(400).json({ message: 'FEN позиция обязательна' });
        }
        if (difficulty) {
            chessAI.setDifficulty(difficulty);
        }
        chessAI.setPosition(fen);
        const move = chessAI.makeMove();
        if (!move) {
            return res.status(400).json({ message: 'Нет доступных ходов' });
        }
        res.json({ move });
    }
    catch (error) {
        console.error('AI move error:', error);
        res.status(500).json({ message: 'Ошибка при получении хода ИИ' });
    }
});
exports.getAIMove = getAIMove;
const trainAI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { positions, evaluations } = req.body;
        if (!positions || !evaluations || positions.length !== evaluations.length) {
            return res.status(400).json({ error: 'Invalid training data' });
        }
        yield chessAI.train(positions, evaluations);
        return res.json({ message: 'AI training completed successfully' });
    }
    catch (error) {
        console.error('Error training AI:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.trainAI = trainAI;
const evaluatePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fen } = req.body;
        if (!fen) {
            return res.status(400).json({ error: 'FEN position is required' });
        }
        const evaluation = yield chessAI.evaluatePosition(fen);
        return res.json({ evaluation });
    }
    catch (error) {
        console.error('Error evaluating position:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.evaluatePosition = evaluatePosition;
