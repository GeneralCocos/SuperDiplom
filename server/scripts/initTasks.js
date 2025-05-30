const mongoose = require('mongoose');
const Task = require('../models/Task');

const tasks = [
  // Легкие задания
  {
    title: 'Мат в 1 ход',
    description: 'Белые начинают и ставят мат в 1 ход',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1',
    solution: ['Qh4#'],
    difficulty: 'easy',
    category: 'мат',
    points: 10
  },
  {
    title: 'Захват фигуры',
    description: 'Белые начинают и могут взять ферзя',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1',
    solution: ['Bxf7+'],
    difficulty: 'easy',
    category: 'тактика',
    points: 10
  },
  {
    title: 'Пат',
    description: 'Черные начинают и могут поставить пат',
    fen: 'k7/8/8/8/8/8/8/K7 b - - 0 1',
    solution: ['Kb1'],
    difficulty: 'easy',
    category: 'пат',
    points: 10
  },

  // Средние задания
  {
    title: 'Мат в 2 хода',
    description: 'Белые начинают и ставят мат в 2 хода',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Qd5+'],
    difficulty: 'medium',
    category: 'мат',
    points: 20
  },
  {
    title: 'Комбинация',
    description: 'Белые начинают и могут получить материальное преимущество',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Qd5+', 'Ke7', 'Qxc6'],
    difficulty: 'medium',
    category: 'тактика',
    points: 20
  },
  {
    title: 'Связка',
    description: 'Белые начинают и могут связать фигуру',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1',
    solution: ['Bd3'],
    difficulty: 'medium',
    category: 'тактика',
    points: 20
  },

  // Сложные задания
  {
    title: 'Мат в 3 хода',
    description: 'Белые начинают и ставят мат в 3 хода',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Qd5+', 'Ke7', 'Qe6+', 'Kd8', 'Qd7#'],
    difficulty: 'hard',
    category: 'мат',
    points: 30
  },
  {
    title: 'Сложная комбинация',
    description: 'Белые начинают и могут получить решающее преимущество',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Qd5+', 'Ke7', 'Qe6+', 'Kd8', 'Qd7+', 'Ke7', 'Qxc6'],
    difficulty: 'hard',
    category: 'тактика',
    points: 30
  },
  {
    title: 'Позиционная жертва',
    description: 'Белые начинают и могут пожертвовать фигуру для получения позиционного преимущества',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Qd5+', 'Ke7', 'Qe6+', 'Kd8', 'Qd7+', 'Ke7', 'Qxc6', 'bxc6'],
    difficulty: 'hard',
    category: 'стратегия',
    points: 30
  }
];

const initTasks = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect('mongodb://localhost:27017/chess', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Очистка существующих заданий
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Добавление новых заданий
    await Task.insertMany(tasks);
    console.log('Added new tasks');

    // Закрытие соединения
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

initTasks(); 