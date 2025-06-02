const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const gameRoutes = require('./gameRoutes');
const tournamentRoutes = require('./tournamentRoutes');

router.use('/auth', authRoutes);
router.use('/game', gameRoutes);
router.use('/tournaments', tournamentRoutes);

module.exports = router; 