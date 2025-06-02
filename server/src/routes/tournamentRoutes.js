const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const auth = require('../middleware/auth');

// Create a new tournament
router.post('/', auth, tournamentController.createTournament);

// Get all tournaments
router.get('/', tournamentController.getTournaments);

// Join a tournament
router.post('/:tournamentId/join', auth, tournamentController.joinTournament);

// Start a tournament
router.post('/:tournamentId/start', auth, tournamentController.startTournament);

module.exports = router; 