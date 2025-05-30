const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskProgress = require('../models/TaskProgress');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get task progress summary
router.get('/progress/summary', auth, async (req, res) => {
  try {
    const tasks = await Task.find();
    const userProgress = await TaskProgress.find({ userId: req.user._id });
    
    const completedTasks = userProgress.filter(p => p.completed).length;
    const totalPoints = userProgress.reduce((sum, p) => sum + p.pointsEarned, 0);
    
    const byDifficulty = {
      easy: { completed: 0, total: 0 },
      medium: { completed: 0, total: 0 },
      hard: { completed: 0, total: 0 }
    };
    
    tasks.forEach(task => {
      byDifficulty[task.difficulty].total++;
      const progress = userProgress.find(p => p.taskId.toString() === task._id.toString());
      if (progress && progress.completed) {
        byDifficulty[task.difficulty].completed++;
      }
    });
    
    res.json({
      totalTasks: tasks.length,
      completedTasks,
      totalPoints,
      byDifficulty
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task (admin only)
router.post('/', [auth, admin], async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    fen: req.body.fen,
    solution: req.body.solution,
    difficulty: req.body.difficulty,
    category: req.body.category,
    points: req.body.points
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Задание не найдено' });
    }
    
    // Удаляем прогресс всех пользователей по этому заданию
    await TaskProgress.deleteMany({ taskId: task._id });
    await task.deleteOne();
    
    res.json({ message: 'Задание удалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check task solution
router.post('/:id/check', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Задание не найдено' });
    }

    const userMoves = req.body.moves;
    const isCorrect = JSON.stringify(userMoves) === JSON.stringify(task.solution);

    if (isCorrect) {
      // Update or create progress
      let progress = await TaskProgress.findOne({
        userId: req.user._id,
        taskId: task._id
      });

      if (!progress) {
        progress = new TaskProgress({
          userId: req.user._id,
          taskId: task._id,
          attempts: 1,
          completed: true,
          pointsEarned: task.points
        });
      } else if (!progress.completed) {
        progress.attempts += 1;
        progress.completed = true;
        progress.pointsEarned = task.points;
      }

      await progress.save();
    }

    res.json({ correct: isCorrect });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 