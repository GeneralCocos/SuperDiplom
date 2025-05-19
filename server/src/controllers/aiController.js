const { Chess } = require('chess.js');
const ChessAI = require('../ai/ChessAI');

const ai = new ChessAI();

const initializeAI = async () => {
  try {
    await ai.initialize();
    console.log('AI initialized successfully');
  } catch (error) {
    console.error('Error initializing AI:', error);
  }
};

const getAIMove = async (req, res) => {
  try {
    const { fen, difficulty = 'easy' } = req.body;

    if (!fen) {
      return res.status(400).json({ error: 'FEN position is required' });
    }

    const chess = new Chess(fen);
    
    if (chess.isGameOver()) {
      return res.status(400).json({ error: 'Game is already over' });
    }

    const bestMove = await ai.getBestMove(fen, difficulty === 'hard' ? 4 : 2);
    
    if (!bestMove) {
      return res.status(400).json({ error: 'No valid moves available' });
    }

    chess.move(bestMove);

    return res.json({
      move: bestMove,
      position: chess.fen(),
      gameOver: chess.isGameOver(),
      inCheck: chess.isCheck(),
      isCheckmate: chess.isCheckmate(),
      isStalemate: chess.isStalemate()
    });
  } catch (error) {
    console.error('Error getting AI move:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const trainAI = async (req, res) => {
  try {
    const { positions, evaluations } = req.body;

    if (!positions || !evaluations || positions.length !== evaluations.length) {
      return res.status(400).json({ error: 'Invalid training data' });
    }

    await ai.train(positions, evaluations);
    
    return res.json({ message: 'AI training completed successfully' });
  } catch (error) {
    console.error('Error training AI:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const evaluatePosition = async (req, res) => {
  try {
    const { fen } = req.body;

    if (!fen) {
      return res.status(400).json({ error: 'FEN position is required' });
    }

    const evaluation = await ai.evaluatePosition(new Chess(fen));
    
    return res.json({ evaluation });
  } catch (error) {
    console.error('Error evaluating position:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  initializeAI,
  getAIMove,
  trainAI,
  evaluatePosition
}; 