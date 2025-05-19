import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ChessBoardProps {
  onMove?: (move: any) => void;
  position?: string;
  orientation?: 'white' | 'black';
  gameOver?: boolean;
  isPlayerTurn?: boolean;
  onGameEnd?: () => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  onMove,
  position,
  orientation = 'white',
  gameOver = false,
  isPlayerTurn = true,
  onGameEnd
}) => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState<string | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (position) {
      const newGame = new Chess();
      newGame.load(position);
      setGame(newGame);
    }
  }, [position]);

  const makeMove = (move: any) => {
    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move(move);
      setGame(gameCopy);
      
      if (onMove) {
        onMove(result);
      }

      if (gameCopy.isGameOver()) {
        if (onGameEnd) {
          onGameEnd();
        }
      }

      return result;
    } catch (error) {
      return null;
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!isPlayerTurn || gameOver) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to queen for simplicity
    });

    if (move === null) return false;
    return true;
  };

  const onSquareClick = (square: string) => {
    if (!isPlayerTurn || gameOver) return;

    // from square
    if (!moveFrom) {
      const piece = game.get(square as Square);
      if (piece && piece.color === (orientation === 'white' ? 'w' : 'b')) {
        setMoveFrom(square);
      }
      return;
    }

    // to square
    if (!moveTo) {
      const move = makeMove({
        from: moveFrom,
        to: square,
        promotion: 'q' // always promote to queen for simplicity
      });

      if (move === null) {
        // invalid move
        setMoveFrom('');
        return;
      }

      setMoveTo(null);
      setMoveFrom('');
      return;
    }
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: 600,
      margin: '0 auto',
      position: 'relative'
    }}>
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[3]
        }}
      />
      {gameOver && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          p: 3,
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h5" gutterBottom>
            Game Over
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setGame(new Chess());
              if (onGameEnd) onGameEnd();
            }}
          >
            New Game
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChessBoard; 