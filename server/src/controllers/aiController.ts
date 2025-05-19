import { Request, Response } from 'express';
import { ChessAI } from '../ai/chessAI';

const chessAI = new ChessAI();

export const initializeAI = async () => {
  try {
    await chessAI.initialize();
    console.log('AI initialized successfully');
  } catch (error) {
    console.error('Error initializing AI:', error);
  }
};

export const getAIMove = async (req: Request, res: Response) => {
  try {
    const { fen, difficulty } = req.body;
    
    if (!fen) {
      return res.status(400).json({ message: 'FEN позиция обязательна' });
    }

    if (difficulty) {
      chessAI.setDifficulty(difficulty);
    }

    chessAI.setPosition(fen);
    const move = chessAI.makeMove();

    if (!move) {
      return res.status(400).json({ message: 'Нет доступных ходов' });
    }

    res.json({ move });
  } catch (error) {
    console.error('AI move error:', error);
    res.status(500).json({ message: 'Ошибка при получении хода ИИ' });
  }
};

export const trainAI = async (req: Request, res: Response) => {
  try {
    const { positions, evaluations } = req.body;

    if (!positions || !evaluations || positions.length !== evaluations.length) {
      return res.status(400).json({ error: 'Invalid training data' });
    }

    await chessAI.train(positions, evaluations);
    
    return res.json({ message: 'AI training completed successfully' });
  } catch (error) {
    console.error('Error training AI:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const evaluatePosition = async (req: Request, res: Response) => {
  try {
    const { fen } = req.body;

    if (!fen) {
      return res.status(400).json({ error: 'FEN position is required' });
    }

    const evaluation = await chessAI.evaluatePosition(fen);
    
    return res.json({ evaluation });
  } catch (error) {
    console.error('Error evaluating position:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 