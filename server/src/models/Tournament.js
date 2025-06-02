const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxParticipants: {
    type: Number,
    required: true,
    min: 2,
    max: 32
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed'],
    default: 'waiting'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rounds: [{
    number: Number,
    matches: [{
      whitePlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      blackPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      result: {
        type: String,
        enum: ['white', 'black', 'draw', 'pending'],
        default: 'pending'
      },
      moves: [{
        from: String,
        to: String,
        promotion: String
      }]
    }]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema); 