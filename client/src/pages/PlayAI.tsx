import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import {
  Container,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';

interface AIResponse {
  from: Square;
  to: Square;
  promotion?: string;
}

const PlayAI: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (game.turn() === 'b') {
      makeAIMove();
    }
  }, [game]);

  const makeAIMove = async () => {
    try {
      const response = await axios.post<AIResponse>('http://localhost:5000/api/chess/ai-move', {
        fen: game.fen(),
        difficulty: 'medium'
      });

      const { from, to, promotion } = response.data;
      const move = { from, to, promotion };
      
      const newGame = new Chess(game.fen());
      newGame.move(move);
      setGame(newGame);
      updateStatus(newGame);
    } catch (error) {
      console.error('Error making AI move:', error);
      setError('Ошибка при получении хода от ИИ');
    }
  };

  const handleMove = (sourceSquare: string, targetSquare: string) => {
    try {
      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move === null) return false;
      
      setGame(newGame);
      updateStatus(newGame);
      return true;
    } catch (err) {
      return false;
    }
  };

  const updateStatus = (chess: Chess) => {
    if (chess.isCheckmate()) {
      setStatus('Шах и мат!');
    } else if (chess.isDraw()) {
      setStatus('Ничья!');
    } else if (chess.isCheck()) {
      setStatus('Шах!');
    } else {
      setStatus('');
    }
  };

  const handleReset = () => {
    setGame(new Chess());
    setStatus('');
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Игра против ИИ
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Сложность</InputLabel>
            <Select
              value={difficulty}
              label="Сложность"
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            >
              <MenuItem value="easy">Легкий</MenuItem>
              <MenuItem value="medium">Средний</MenuItem>
              <MenuItem value="hard">Сложный</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {status && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {status}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Chessboard
            position={game.fen()}
            onPieceDrop={handleMove}
            boardWidth={600}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleReset}
          sx={{ mt: 2 }}
        >
          Новая игра
        </Button>
      </Paper>
    </Container>
  );
};

export default PlayAI; 