const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const auth = require('../middleware/auth');

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    console.log('Fetching tournaments...');
    const tournaments = await Tournament.find()
      .populate('creator', 'username')
      .populate('participants', 'username')
      .populate('winner', 'username');
    console.log('Tournaments found:', tournaments.length);
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ 
      message: 'Error fetching tournaments',
      error: error.message 
    });
  }
});

// Create a new tournament
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating tournament with data:', req.body);
    const { name, maxParticipants } = req.body;

    if (!name || !maxParticipants) {
      return res.status(400).json({ 
        message: 'Name and maxParticipants are required' 
      });
    }

    const tournament = new Tournament({
      name,
      creator: req.user._id,
      maxParticipants,
      participants: [req.user._id],
      status: 'waiting'
    });

    console.log('Saving tournament:', tournament);
    await tournament.save();
    
    const populatedTournament = await Tournament.findById(tournament._id)
      .populate('creator', 'username')
      .populate('participants', 'username');
    
    console.log('Tournament created:', populatedTournament);
    req.app.get('io').emit('tournament:new', populatedTournament);
    res.status(201).json(populatedTournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ 
      message: 'Error creating tournament',
      error: error.message 
    });
  }
});

// Delete a tournament
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting tournament:', req.params.id);
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    if (tournament.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator can delete the tournament' });
    }

    if (tournament.status !== 'waiting') {
      return res.status(400).json({ message: 'Can only delete tournaments that are in waiting status' });
    }

    await tournament.deleteOne();
    req.app.get('io').emit('tournament:delete', tournament._id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({ 
      message: 'Error deleting tournament',
      error: error.message 
    });
  }
});

// Join a tournament
router.post('/:id/join', auth, async (req, res) => {
  try {
    console.log('Joining tournament:', req.params.id);
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    if (tournament.status !== 'waiting') {
      return res.status(400).json({ message: 'Tournament is not accepting participants' });
    }

    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({ message: 'Tournament is full' });
    }

    if (tournament.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Already joined this tournament' });
    }

    tournament.participants.push(req.user._id);
    await tournament.save();

    const updatedTournament = await Tournament.findById(tournament._id)
      .populate('creator', 'username')
      .populate('participants', 'username');

    console.log('Tournament updated:', updatedTournament);
    req.app.get('io').emit('tournament:update', updatedTournament);
    res.json(updatedTournament);
  } catch (error) {
    console.error('Error joining tournament:', error);
    res.status(500).json({ 
      message: 'Error joining tournament',
      error: error.message 
    });
  }
});

// Start a tournament
router.post('/:id/start', auth, async (req, res) => {
  try {
    console.log('Starting tournament:', req.params.id);
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    if (tournament.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator can start the tournament' });
    }

    if (tournament.status !== 'waiting') {
      return res.status(400).json({ message: 'Tournament is already in progress or completed' });
    }

    if (tournament.participants.length < 2) {
      return res.status(400).json({ message: 'Need at least 2 participants to start' });
    }

    tournament.status = 'in_progress';
    tournament.startTime = new Date();
    await tournament.save();

    const updatedTournament = await Tournament.findById(tournament._id)
      .populate('creator', 'username')
      .populate('participants', 'username');

    console.log('Tournament started:', updatedTournament);
    req.app.get('io').emit('tournament:update', updatedTournament);
    res.json(updatedTournament);
  } catch (error) {
    console.error('Error starting tournament:', error);
    res.status(500).json({ 
      message: 'Error starting tournament',
      error: error.message 
    });
  }
});

module.exports = router; 