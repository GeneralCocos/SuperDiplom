"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAI = void 0;
const chess_js_1 = require("chess.js");
const initializeAI = () => {
    // Initialize chess engine
    const chess = new chess_js_1.Chess();
    console.log('Chess engine initialized');
    return chess;
};
exports.initializeAI = initializeAI;
