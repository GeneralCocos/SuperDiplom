const mongoose = require('mongoose');

const taskProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  lastAttempt: {
    type: Date,
    default: Date.now
  }
});

// Создаем составной индекс для уникальности прогресса пользователя по заданию
taskProgressSchema.index({ userId: 1, taskId: 1 }, { unique: true });

module.exports = mongoose.model('TaskProgress', taskProgressSchema); 