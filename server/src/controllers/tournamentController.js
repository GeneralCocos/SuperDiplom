const Tournament = require('../models/Tournament');
const User = require('../models/User');

exports.createTournament = async (req, res) => {
  try {
    const { name, maxParticipants } = req.body;
    const creator = req.user._id;

    const tournament = new Tournament({
      name,
      maxParticipants,
      creator,
      participants: [creator],
      status: 'waiting'
    });

    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ message: 'Error creating tournament' });
  }
};

exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('creator', 'username')
      .populate('participants', 'username');
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: 'Error fetching tournaments' });
  }
};

exports.joinTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const userId = req.user._id;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    if (tournament.status !== 'waiting') {
      return res.status(400).json({ message: 'Tournament is not accepting participants' });
    }

    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({ message: 'Tournament is full' });
    }

    if (tournament.participants.includes(userId)) {
      return res.status(400).json({ message: 'Already joined this tournament' });
    }

    tournament.participants.push(userId);
    await tournament.save();

    res.json(tournament);
  } catch (error) {
    console.error('Error joining tournament:', error);
    res.status(500).json({ message: 'Error joining tournament' });
  }
};

exports.startTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const userId = req.user._id;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    if (tournament.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only tournament creator can start the tournament' });
    }

    if (tournament.status !== 'waiting') {
      return res.status(400).json({ message: 'Tournament has already started or completed' });
    }

    if (tournament.participants.length < 2) {
      return res.status(400).json({ message: 'Need at least 2 participants to start tournament' });
    }

    tournament.status = 'in_progress';
    tournament.startTime = new Date();
    await tournament.save();

    // TODO: Implement tournament bracket generation and first round pairing

    res.json(tournament);
  } catch (error) {
    console.error('Error starting tournament:', error);
    res.status(500).json({ message: 'Error starting tournament' });
  }
}; 