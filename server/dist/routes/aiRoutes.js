"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chessAI_1 = require("../ai/chessAI");
const aiController_1 = require("../controllers/aiController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const ai = new chessAI_1.ChessAI();
// Get AI move for a given position
router.post('/move', auth_1.authenticate, aiController_1.getAIMove);
// Train AI with new positions (protected route)
router.post('/train', auth_1.authenticate, aiController_1.trainAI);
// Evaluate a position
router.post('/evaluate', aiController_1.evaluatePosition);
exports.default = router;
