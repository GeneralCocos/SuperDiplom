import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import axios from 'axios';
import { MoveResponse } from '../types/api';

const PlayAI: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const handleMove = async (from: string, to: string, promotion?: string) => {
    try {
      const response = await axios.post<MoveResponse>('http://localhost:5000/api/game/move', {
        gameId,
        from,
        to,
        promotion
      });

      const { move, fen, isCheck, isCheckmate, isStalemate } = response.data;
      const newGame = new Chess(game.fen());
      newGame.move({ from, to, promotion });
      setGame(newGame);
      
      if (isCheckmate || isStalemate) {
        setGameOver(true);
      }
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move === null) return false;
      setGame(new Chess(game.fen()));
      setIsPlayerTurn(false);
      handleMove(sourceSquare, targetSquare, 'q');
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Игра против ИИ
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={600}
        />
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {isPlayerTurn ? 'Ваш ход' : 'Ход ИИ...'}
        </Typography>
      </Box>
    </Container>
  );
};

export default PlayAI; 