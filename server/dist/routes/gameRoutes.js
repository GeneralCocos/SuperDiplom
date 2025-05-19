"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Create a new game
router.post('/create', auth_1.authenticate, (req, res) => {
    res.json({ message: 'Create game endpoint' });
});
// Join an existing game
router.post('/join/:gameId', auth_1.authenticate, (req, res) => {
    res.json({ message: 'Join game endpoint' });
});
// Get game state
router.get('/:gameId', auth_1.authenticate, (req, res) => {
    res.json({ message: 'Get game state endpoint' });
});
// Make a move
router.post('/:gameId/move', auth_1.authenticate, (req, res) => {
    res.json({ message: 'Make move endpoint' });
});
exports.default = router;
