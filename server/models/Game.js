const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['ai', 'online'],
    required: true
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 20 // время в минутах
  },
  whiteTimeLeft: {
    type: Number,
    required: true
  },
  blackTimeLeft: {
    type: Number,
    required: true
  },
  whitePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blackPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting'
  },
  currentTurn: {
    type: String,
    enum: ['white', 'black'],
    default: 'white'
  },
  winner: {
    type: String,
    enum: ['white', 'black', null],
    default: null
  },
  fen: {
    type: String,
    required: true,
    default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  },
  moves: [{
    from: String,
    to: String,
    piece: String,
    color: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Предварительная обработка перед сохранением
gameSchema.pre('save', function(next) {
  if (this.isNew) {
    // Устанавливаем начальное время для обоих игроков
    this.whiteTimeLeft = this.timeLimit * 60; // конвертируем минуты в секунды
    this.blackTimeLeft = this.timeLimit * 60;
  }
  next();
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game; 