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
const chess_js_1 = require("chess.js");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get AI move
router.post('/move', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fen, difficulty = 'medium' } = req.body;
        console.log('Received AI move request:', { fen, difficulty });
        const game = new chess_js_1.Chess(fen);
        const moves = game.moves();
        if (moves.length === 0) {
            console.log('No moves available');
            return res.status(400).json({ message: 'Нет доступных ходов' });
        }
        console.log('Available moves:', moves);
        let selectedMove;
        switch (difficulty) {
            case 'easy':
                // Random move
                selectedMove = moves[Math.floor(Math.random() * moves.length)];
                console.log('Easy mode - selected random move:', selectedMove);
                break;
            case 'medium':
                // Evaluate moves based on piece values and position
                selectedMove = evaluateMoves(game, moves);
                console.log('Medium mode - selected evaluated move:', selectedMove);
                break;
            case 'hard':
                // Use minimax algorithm with alpha-beta pruning
                selectedMove = minimax(game, 3, -Infinity, Infinity, true);
                console.log('Hard mode - selected minimax move:', selectedMove);
                break;
            default:
                selectedMove = moves[Math.floor(Math.random() * moves.length)];
                console.log('Default mode - selected random move:', selectedMove);
        }
        // Make the move
        const moveResult = game.move(selectedMove);
        if (!moveResult) {
            console.error('Invalid move:', selectedMove);
            return res.status(400).json({ message: 'Недопустимый ход' });
        }
        console.log('Move made successfully:', moveResult);
        res.json({
            move: selectedMove,
            fen: game.fen()
        });
    }
    catch (error) {
        console.error('AI move error:', error);
        res.status(500).json({ message: 'Ошибка при получении хода ИИ' });
    }
}));
// Helper function to evaluate moves
function evaluateMoves(game, moves) {
    const pieceValues = {
        'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
    };
    let bestMove = moves[0];
    let bestScore = -Infinity;
    for (const move of moves) {
        const tempGame = new chess_js_1.Chess(game.fen());
        const moveResult = tempGame.move(move);
        if (!moveResult)
            continue;
        let score = 0;
        const board = tempGame.board();
        // Evaluate piece values and position
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                    const value = pieceValues[piece.type.toLowerCase()];
                    score += piece.color === 'w' ? value : -value;
                }
            }
        }
        // Add position bonus
        score += evaluatePosition(tempGame);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}
// Helper function to evaluate position
function evaluatePosition(game) {
    let score = 0;
    // Check for checkmate
    if (game.isCheckmate()) {
        return game.turn() === 'w' ? -1000 : 1000;
    }
    // Check for check
    if (game.isCheck()) {
        score += game.turn() === 'w' ? -50 : 50;
    }
    // Evaluate piece mobility
    const moves = game.moves().length;
    score += game.turn() === 'w' ? moves : -moves;
    // Add center control bonus
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    for (const square of centerSquares) {
        const piece = game.get(square);
        if (piece) {
            score += piece.color === 'w' ? 10 : -10;
        }
    }
    return score;
}
// Minimax algorithm with alpha-beta pruning
function minimax(game, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || game.isGameOver()) {
        return evaluatePosition(game).toString();
    }
    const moves = game.moves();
    let bestMove = moves[0];
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const tempGame = new chess_js_1.Chess(game.fen());
            const moveResult = tempGame.move(move);
            if (!moveResult)
                continue;
            const evaluation = Number(minimax(tempGame, depth - 1, alpha, beta, false));
            if (evaluation > maxEval) {
                maxEval = evaluation;
                bestMove = move;
            }
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha)
                break;
        }
        return bestMove;
    }
    else {
        let minEval = Infinity;
        for (const move of moves) {
            const tempGame = new chess_js_1.Chess(game.fen());
            const moveResult = tempGame.move(move);
            if (!moveResult)
                continue;
            const evaluation = Number(minimax(tempGame, depth - 1, alpha, beta, true));
            if (evaluation < minEval) {
                minEval = evaluation;
                bestMove = move;
            }
            beta = Math.min(beta, evaluation);
            if (beta <= alpha)
                break;
        }
        return bestMove;
    }
}
exports.default = router;
