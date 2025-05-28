import React, { useState, useEffect, CSSProperties } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Alert,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  '& .highlight-square': {
    backgroundColor: 'rgba(173, 216, 230, 0.3)', // голубой для возможных ходов
  },
  '& .source-square': {
    backgroundColor: 'rgba(255, 255, 0, 0.5)', // желтый для исходной позиции
  },
  '& .target-square': {
    backgroundColor: 'rgba(0, 255, 0, 0.3)', // зеленый для целевой позиции
  }
}));

type CustomSquareStyles = { [square: string]: CSSProperties };

interface ExtendedChessboardProps {
  position: string;
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  onSquareClick: (square: string) => void;
  boardWidth: number;
  customSquareStyles?: CustomSquareStyles;
  customBoardStyle?: React.CSSProperties;
}

const CustomChessboard: React.FC<ExtendedChessboardProps> = (props) => {
  return <Chessboard {...(props as any)} />;
};

interface PieceLearningProps {
  piece: keyof typeof pieceConfigs;
  onComplete: () => void;
}

interface HighlightSquare {
  file: number;
  rank: number;
}

interface PieceConfig {
  startPosition: string;
  allowedSquares: string[];
  description: string;
  prepareBoardForMove?: (game: Chess) => Chess;
  tasks: Task[];
}

interface Task {
  description: string;
  validateMove: (from: string, to: string) => boolean;
  highlightSquares?: (from: string) => string[];
}

const pieceNames: { [key: string]: string } = {
  pawn: 'Пешка',
  knight: 'Конь',
  bishop: 'Слон',
  rook: 'Ладья',
  queen: 'Ферзь',
  king: 'Король'
};

const pieceConfigs: { [key: string]: PieceConfig } = {
  pawn: {
    startPosition: '4k3/8/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1',
    allowedSquares: ['a3', 'a4', 'b3', 'b4', 'c3', 'c4', 'd3', 'd4', 'e3', 'e4', 'f3', 'f4', 'g3', 'g4', 'h3', 'h4'],
    description: 'Пешки могут ходить на одну или две клетки вперед при первом ходе. Попробуйте походить разными пешками.',
    tasks: [
      { 
        description: 'Сделайте ход любой пешкой на одну клетку вперед',
        validateMove: (from: string, to: string) => {
          return from[1] === '2' && to[1] === '3' && from[0] === to[0];
        },
        highlightSquares: (from: string) => {
          return [`${from[0]}3`];
        }
      },
      { 
        description: 'Сделайте ход любой пешкой на две клетки вперед',
        validateMove: (from: string, to: string) => {
          return from[1] === '2' && to[1] === '4' && from[0] === to[0];
        },
        highlightSquares: (from: string) => {
          return [`${from[0]}4`];
        }
      }
    ]
  },
  knight: {
    startPosition: '4k3/8/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1',
    allowedSquares: ['f3', 'h3'],
    description: 'Конь ходит буквой "Г": на две клетки по вертикали и одну по горизонтали, или наоборот.',
    tasks: [
      { 
        description: 'Сделайте ход конём на f3',
        validateMove: (from: string, to: string) => {
          return from === 'g1' && to === 'f3';
        }
      },
      { 
        description: 'Сделайте ход конём на h3',
        validateMove: (from: string, to: string) => {
          return from === 'g1' && to === 'h3';
        }
      }
    ]
  },
  bishop: {
    startPosition: '4k3/8/8/8/8/8/PP1P1P1P/RNBQKBNR w - - 0 1',
    allowedSquares: ['a3', 'b4', 'c5', 'd6', 'e7', 'b2', 'd2', 'e3', 'f4', 'g5', 'h6'],
    description: 'Слон ходит по диагонали на любое количество клеток. Пешки убраны для свободного хода.',
    tasks: [
      { 
        description: 'Сделайте ход слоном по короткой диагонали',
        validateMove: (from: string, to: string) => {
          const fromFile = from.charCodeAt(0) - 97;
          const toFile = to.charCodeAt(0) - 97;
          const fromRank = parseInt(from[1]);
          const toRank = parseInt(to[1]);
          return Math.abs(toFile - fromFile) === Math.abs(toRank - fromRank) && Math.abs(toFile - fromFile) <= 2;
        },
        highlightSquares: (from: string) => {
          const squares: string[] = [];
          const file = from.charCodeAt(0) - 97;
          const rank = parseInt(from[1]);
          
          // Add all possible diagonal squares within 2 steps
          for (let i = 1; i <= 2; i++) {
            const possibleMoves: HighlightSquare[] = [
              { file: file + i, rank: rank + i },
              { file: file + i, rank: rank - i },
              { file: file - i, rank: rank + i },
              { file: file - i, rank: rank - i }
            ];
            
            possibleMoves.forEach(move => {
              if (move.file >= 0 && move.file < 8 && move.rank > 0 && move.rank <= 8) {
                squares.push(`${String.fromCharCode(97 + move.file)}${move.rank}`);
              }
            });
          }
          return squares;
        }
      },
      { 
        description: 'Сделайте ход слоном по длинной диагонали',
        validateMove: (from: string, to: string) => {
          const fromFile = from.charCodeAt(0) - 97;
          const toFile = to.charCodeAt(0) - 97;
          const fromRank = parseInt(from[1]);
          const toRank = parseInt(to[1]);
          return Math.abs(toFile - fromFile) === Math.abs(toRank - fromRank) && Math.abs(toFile - fromFile) > 2;
        },
        highlightSquares: (from: string) => {
          const squares: string[] = [];
          const file = from.charCodeAt(0) - 97;
          const rank = parseInt(from[1]);
          
          // Add all possible diagonal squares beyond 2 steps
          for (let i = 3; i <= 7; i++) {
            const possibleMoves: HighlightSquare[] = [
              { file: file + i, rank: rank + i },
              { file: file + i, rank: rank - i },
              { file: file - i, rank: rank + i },
              { file: file - i, rank: rank - i }
            ];
            
            possibleMoves.forEach(move => {
              if (move.file >= 0 && move.file < 8 && move.rank > 0 && move.rank <= 8) {
                squares.push(`${String.fromCharCode(97 + move.file)}${move.rank}`);
              }
            });
          }
          return squares;
        }
      }
    ]
  },
  rook: {
    startPosition: '4k3/8/8/8/8/8/1PPPPPPP/RNBQKBNR w - - 0 1',
    allowedSquares: ['a3', 'a4', 'a5', 'a6', 'a7', 'b1', 'c1', 'd1'],
    description: 'Ладья ходит по горизонтали или вертикали на любое количество клеток.',
    tasks: [
      { 
        description: 'Сделайте вертикальный ход ладьёй',
        validateMove: (from: string, to: string) => {
          return from[0] === to[0] && from[1] !== to[1];
        },
        highlightSquares: (from: string) => {
          const squares: string[] = [];
          const file = from[0];
          for (let rank = 1; rank <= 8; rank++) {
            if (rank.toString() !== from[1]) {
              squares.push(`${file}${rank}`);
            }
          }
          return squares;
        }
      },
      { 
        description: 'Сделайте горизонтальный ход ладьёй',
        validateMove: (from: string, to: string) => {
          return from[1] === to[1];
        },
        highlightSquares: (from: string) => {
          const squares: string[] = [];
          const rank = from[1];
          for (let fileCode = 97; fileCode <= 104; fileCode++) {
            const file = String.fromCharCode(fileCode);
            if (file !== from[0]) {
              squares.push(`${file}${rank}`);
            }
          }
          return squares;
        }
      }
    ]
  },
  queen: {
    startPosition: '4k3/8/8/8/8/8/P1P2PPP/RNBQKBNR w - - 0 1',
    allowedSquares: ['b2', 'c2', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'e3', 'e4', 'e5', 'e6', 'c3', 'f3', 'b4', 'g4', 'a5', 'h5'],
    description: 'Ферзь может ходить как ладья и слон - по горизонтали, вертикали и диагонали.',
    tasks: [
      { 
        description: 'Сделайте вертикальный ход ферзём',
        validateMove: (from: string, to: string) => {
          return from[0] === to[0] && from[1] !== to[1];
        },
        highlightSquares: (from: string) => {
          const squares: string[] = [];
          const file = from[0];
          // Add all vertical squares
          for (let rank = 1; rank <= 8; rank++) {
            if (rank.toString() !== from[1]) {
              squares.push(`${file}${rank}`);
            }
          }
          return squares;
        }
      },
      { 
        description: 'Сделайте диагональный ход ферзём',
        validateMove: (from: string, to: string) => {
          const fromFile = from.charCodeAt(0) - 97;
          const toFile = to.charCodeAt(0) - 97;
          const fromRank = parseInt(from[1]);
          const toRank = parseInt(to[1]);
          return Math.abs(toFile - fromFile) === Math.abs(toRank - fromRank);
        },
        highlightSquares: (from: string) => {
          const squares: string[] = [];
          const file = from.charCodeAt(0) - 97;
          const rank = parseInt(from[1]);
          
          // Add all diagonal squares
          for (let i = 1; i <= 7; i++) {
            const possibleMoves: HighlightSquare[] = [
              { file: file + i, rank: rank + i },
              { file: file + i, rank: rank - i },
              { file: file - i, rank: rank + i },
              { file: file - i, rank: rank - i }
            ];
            
            possibleMoves.forEach(move => {
              if (move.file >= 0 && move.file < 8 && move.rank > 0 && move.rank <= 8) {
                squares.push(`${String.fromCharCode(97 + move.file)}${move.rank}`);
              }
            });
          }
          return squares;
        }
      }
    ]
  },
  king: {
    startPosition: '4k3/8/8/8/8/8/PPP1PPPP/RNBQKBNR w - - 0 1',
    allowedSquares: ['d2', 'e2', 'f2', 'd1', 'f1', 'e3'],
    description: 'Король может ходить на одну клетку в любом направлении.',
    tasks: [
      { 
        description: 'Сделайте ход королём на одну клетку вперед',
        validateMove: (from: string, to: string) => {
          const fromFile = from.charCodeAt(0) - 97;
          const toFile = to.charCodeAt(0) - 97;
          const fromRank = parseInt(from[1]);
          const toRank = parseInt(to[1]);
          return Math.abs(toFile - fromFile) <= 1 && toRank === fromRank + 1;
        },
        highlightSquares: (from: string) => {
          const squares: string[] = [];
          const file = from.charCodeAt(0) - 97;
          const rank = parseInt(from[1]);
          
          // Add forward squares
          if (rank < 8) {
            squares.push(`${String.fromCharCode(97 + file)}${rank + 1}`);
            if (file > 0) {
              squares.push(`${String.fromCharCode(97 + file - 1)}${rank + 1}`);
            }
            if (file < 7) {
              squares.push(`${String.fromCharCode(97 + file + 1)}${rank + 1}`);
            }
          }
          return squares;
        }
      },
      { 
        description: 'Сделайте ход королём по диагонали',
        validateMove: (from: string, to: string) => {
          const fromFile = from.charCodeAt(0) - 97;
          const toFile = to.charCodeAt(0) - 97;
          const fromRank = parseInt(from[1]);
          const toRank = parseInt(to[1]);
          return Math.abs(toFile - fromFile) === 1 && Math.abs(toRank - fromRank) === 1;
        },
        highlightSquares: (from: string) => {
          const squares: string[] = [];
          const file = from.charCodeAt(0) - 97;
          const rank = parseInt(from[1]);
          
          // Add diagonal squares
          const possibleMoves: HighlightSquare[] = [
            { file: file + 1, rank: rank + 1 },
            { file: file + 1, rank: rank - 1 },
            { file: file - 1, rank: rank + 1 },
            { file: file - 1, rank: rank - 1 }
          ];
          
          possibleMoves.forEach(move => {
            if (move.file >= 0 && move.file < 8 && move.rank > 0 && move.rank <= 8) {
              squares.push(`${String.fromCharCode(97 + move.file)}${move.rank}`);
            }
          });
          return squares;
        }
      }
    ]
  }
};

const PieceLearning: React.FC<PieceLearningProps> = ({ piece, onComplete }): JSX.Element => {
  const [game, setGame] = useState<Chess>(new Chess(pieceConfigs[piece].startPosition));
  const [currentTask, setCurrentTask] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string }>({
    type: 'info',
    text: pieceConfigs[piece].tasks[0].description
  });
  const [progress, setProgress] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);
  const [lastRookPosition, setLastRookPosition] = useState<string | null>(null);

  useEffect(() => {
    // Reset game when piece changes
    const newGame = new Chess(pieceConfigs[piece].startPosition);
    
    // If it's bishop training, prepare the board
    const config = pieceConfigs[piece];
    if (piece === 'bishop' && config.prepareBoardForMove) {
      config.prepareBoardForMove(newGame);
    }
    
    setGame(newGame);
    setCurrentTask(0);
    setProgress(0);
    setMessage({
      type: 'info',
      text: pieceConfigs[piece].tasks[0].description
    });
    setSelectedSquare(null);
    setHighlightedSquares([]);
    setLastRookPosition(null);
  }, [piece]);

  const onSquareClick = (square: string): void => {
    try {
      const currentTaskConfig = pieceConfigs[piece].tasks[currentTask];
      
      if (!selectedSquare) {
        // First click - select piece and show possible moves
        const pieceOnSquare = game.get(square as Square);
        if (pieceOnSquare) {
          setSelectedSquare(square);
          const config = pieceConfigs[piece].tasks[currentTask];
          if (config && typeof config.highlightSquares === 'function') {
            setHighlightedSquares(config.highlightSquares(square));
          }
        }
      } else {
        // Second click - attempt move
        onDrop(selectedSquare, square);
        setSelectedSquare(null);
        setHighlightedSquares([]);
      }
    } catch (error) {
      console.error('Error in onSquareClick:', error);
      setMessage({
        type: 'error',
        text: 'Этот ход недоступен. Попробуйте другой ход.'
      });
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    try {
      const currentTaskConfig = pieceConfigs[piece].tasks[currentTask];
      const gameCopy = new Chess(game.fen());
      
      // Validate the move according to chess rules
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (!move) {
        setMessage({
          type: 'error',
          text: 'Этот ход недоступен. Попробуйте другой ход.'
        });
        return false;
      }

      // Special handling for rook tasks
      if (piece === 'rook') {
        const isFirstTask = currentTask === 0;
        const isSecondTask = currentTask === 1;
        
        if (isFirstTask) {
          // For first task - vertical move
          if (currentTaskConfig.validateMove(sourceSquare, targetSquare)) {
            setLastRookPosition(targetSquare); // Save the rook's position
            setGame(gameCopy);
            setMessage({ type: 'success', text: 'Правильно! Отличный ход!' });
            setCurrentTask(prev => prev + 1);
            setProgress(50);
            setTimeout(() => {
              // Reset to initial position but keep the rook at its new position
              const newGame = new Chess(pieceConfigs[piece].startPosition);
              // Remove the rook from its initial position and place it at the new position
              newGame.remove(sourceSquare as Square);
              newGame.put({ type: 'r', color: 'w' }, targetSquare as Square);
              setGame(newGame);
              setMessage({
                type: 'info',
                text: pieceConfigs[piece].tasks[1].description
              });
            }, 1500);
            return true;
          }
        } else if (isSecondTask) {
          // For second task - any horizontal move from current position
          if (sourceSquare === lastRookPosition && move.piece === 'r' && sourceSquare[1] === targetSquare[1]) {
            setGame(gameCopy);
            setMessage({ type: 'success', text: 'Правильно! Отличный ход!' });
            setProgress(100);
            onComplete();
            return true;
          }
        }
      } else {
        // Normal handling for other pieces
        if (currentTaskConfig.validateMove(sourceSquare, targetSquare)) {
          setGame(gameCopy);
          setMessage({ type: 'success', text: 'Правильно! Отличный ход!' });
          
          if (currentTask === pieceConfigs[piece].tasks.length - 1) {
            setProgress(100);
            onComplete();
          } else {
            setCurrentTask(prev => prev + 1);
            setProgress((currentTask + 1) * (100 / pieceConfigs[piece].tasks.length));
            setTimeout(() => {
              const newGame = new Chess(pieceConfigs[piece].startPosition);
              setGame(newGame);
              setMessage({
                type: 'info',
                text: pieceConfigs[piece].tasks[currentTask + 1].description
              });
            }, 1500);
          }
          return true;
        }
      }

      setMessage({
        type: 'error',
        text: 'Этот ход не соответствует заданию. Попробуйте еще раз!'
      });
      return false;
    } catch (error) {
      console.error('Error in onDrop:', error);
      setMessage({
        type: 'error',
        text: 'Этот ход недоступен. Попробуйте другой ход.'
      });
      return false;
    }
  };

  const resetTraining = () => {
    const newGame = new Chess(pieceConfigs[piece].startPosition);
    setGame(newGame);
    setCurrentTask(0);
    setProgress(0);
    setMessage({
      type: 'info',
      text: pieceConfigs[piece].tasks[0].description
    });
    setSelectedSquare(null);
    setHighlightedSquares([]);
    setLastRookPosition(null);
  };

  const customSquareStyles: CustomSquareStyles = {};
  
  // Add highlighting for selected square
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(255, 255, 0, 0.5)' // Yellow highlight for selected piece
    };
  }
  
  // Add highlighting for possible moves
  highlightedSquares.forEach(square => {
    customSquareStyles[square] = {
      backgroundColor: 'rgba(173, 216, 230, 0.4)' // Light blue highlight for possible moves
    };
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Обучение: {pieceNames[piece]}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {pieceConfigs[piece].description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      </Grid>
      <Grid item xs={12}>
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <StyledPaper elevation={3} sx={{ p: 2 }}>
          <CustomChessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            boardWidth={400}
            customSquareStyles={customSquareStyles}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}
          />
        </StyledPaper>
      </Grid>
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={resetTraining}
          sx={{ mt: 2 }}
        >
          Сбросить задание
        </Button>
      </Grid>
    </Grid>
  );
};

export default PieceLearning; 