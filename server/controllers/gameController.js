const Game = require('../models/Game');
const { Chess } = require('chess.js');

// Создание новой игры
exports.createGame = async (req, res) => {
  try {
    const { mode, timeLimit } = req.body;
    const game = new Game({
      mode,
      timeLimit,
      whitePlayer: req.user._id,
      blackPlayer: mode === 'ai' ? 'ai' : null,
      status: 'active',
      currentTurn: 'white',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании игры', error: error.message });
  }
};

// Получение хода от ИИ
exports.getAIMove = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Игра не найдена' });
    }

    if (game.mode !== 'ai' || game.currentTurn !== 'black') {
      return res.status(400).json({ message: 'Неверный режим игры или ход' });
    }

    const chess = new Chess(game.fen);
    const moves = chess.moves();
    
    if (moves.length === 0) {
      return res.status(400).json({ message: 'Нет доступных ходов' });
    }

    // Простой ИИ: выбираем случайный ход
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    chess.move(randomMove);

    game.fen = chess.fen();
    game.currentTurn = 'white';
    game.status = chess.isGameOver() ? 'finished' : 'active';
    if (chess.isCheckmate()) {
      game.winner = 'black';
    }

    await game.save();
    res.json({ move: randomMove, fen: game.fen });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении хода ИИ', error: error.message });
  }
};

// Обновление времени игрока
exports.updatePlayerTime = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { player, timeLeft } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Игра не найдена' });
    }

    if (player === 'white') {
      game.whiteTimeLeft = timeLeft;
    } else {
      game.blackTimeLeft = timeLeft;
    }

    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении времени', error: error.message });
  }
};

// Получение информации об игре
exports.getGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ message: 'Игра не найдена' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении информации об игре', error: error.message });
  }
}; 