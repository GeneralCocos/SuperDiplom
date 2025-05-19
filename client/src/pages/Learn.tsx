import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from '@mui/material';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

interface TutorialStep {
  title: string;
  description: string;
  initialPosition: string;
  moves: string[];
  explanation: string;
  specialMoves?: string[];
  imageUrl: string;
}

const pieceTutorials: TutorialStep[] = [
  {
    title: 'Пешка',
    description: 'Пешка - самая многочисленная фигура на доске. Она может двигаться только вперед.',
    initialPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: ['e2e4', 'e7e5', 'e4e5', 'd7d5', 'e5d6'],
    explanation: 'Пешка может двигаться на одну или две клетки вперед при первом ходе, и только на одну клетку в последующих ходах. Бьет по диагонали.',
    specialMoves: [
      'Взятие на проходе (en passant) - если пешка делает первый ход на две клетки и проходит мимо пешки противника, та может взять её как будто она пошла на одну клетку.',
      'Превращение пешки - когда пешка достигает последней горизонтали, она может превратиться в любую фигуру (кроме короля).'
    ],
    imageUrl: '/images/pawn.png'
  },
  {
    title: 'Конь',
    description: 'Конь - единственная фигура, которая может перепрыгивать через другие фигуры.',
    initialPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: ['b1c3', 'b8c6', 'c3d5', 'c6d4'],
    explanation: 'Конь ходит буквой "Г": на две клетки по горизонтали и одну по вертикали, или на две по вертикали и одну по горизонтали.',
    specialMoves: [
      'Конь может перепрыгивать через другие фигуры.',
      'Конь всегда ходит на клетку противоположного цвета.'
    ],
    imageUrl: '/images/knight.png'
  },
  {
    title: 'Слон',
    description: 'Слон может двигаться на любое количество клеток по диагонали.',
    initialPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: ['c1e3', 'c8e6', 'e3c5', 'e6c4'],
    explanation: 'Слон ходит по диагонали на любое количество клеток. Каждый слон может двигаться только по клеткам одного цвета.',
    specialMoves: [
      'Слон не может перепрыгивать через другие фигуры.',
      'В начале игры у каждого игрока есть два слона: один ходит по белым диагоналям, другой по черным.'
    ],
    imageUrl: '/images/bishop.png'
  },
  {
    title: 'Ладья',
    description: 'Ладья может двигаться на любое количество клеток по горизонтали или вертикали.',
    initialPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: ['a1a3', 'a8a6', 'a3c3', 'a6c6'],
    explanation: 'Ладья ходит по горизонтали или вертикали на любое количество клеток.',
    specialMoves: [
      'Ладья участвует в рокировке - специальном ходе, когда король и ладья меняются местами.',
      'Ладья не может перепрыгивать через другие фигуры.'
    ],
    imageUrl: '/images/rook.png'
  },
  {
    title: 'Ферзь',
    description: 'Ферзь - самая сильная фигура, сочетающая возможности ладьи и слона.',
    initialPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: ['d1d3', 'd8d6', 'd3g3', 'd6g6'],
    explanation: 'Ферзь может ходить как ладья (по горизонтали и вертикали) и как слон (по диагонали) на любое количество клеток.',
    specialMoves: [
      'Ферзь - самая сильная фигура на доске.',
      'Ферзь не может перепрыгивать через другие фигуры.'
    ],
    imageUrl: '/images/queen.png'
  },
  {
    title: 'Король',
    description: 'Король - самая важная фигура. Игра заканчивается, когда король находится под угрозой.',
    initialPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: ['e1e2', 'e8e7', 'e2e3', 'e7e6'],
    explanation: 'Король может ходить на одну клетку в любом направлении. Его нельзя ставить под удар.',
    specialMoves: [
      'Рокировка - специальный ход, когда король и ладья меняются местами.',
      'Король не может ходить на атакованные поля.',
      'Если король находится под атакой (шах), игрок обязан защитить его.'
    ],
    imageUrl: '/images/king.png'
  }
];

const Learn: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [moveIndex, setMoveIndex] = useState(0);

  const currentTutorial = pieceTutorials[activeStep];

  const handleNext = () => {
    if (activeStep === pieceTutorials.length - 1) {
      setActiveStep(0);
      setMoveIndex(0);
      setGame(new Chess());
    } else {
      setActiveStep((prevStep) => prevStep + 1);
      setMoveIndex(0);
      setGame(new Chess(currentTutorial.initialPosition));
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setMoveIndex(0);
    setGame(new Chess(pieceTutorials[activeStep - 1].initialPosition));
  };

  const handleMove = () => {
    if (moveIndex < currentTutorial.moves.length) {
      const move = currentTutorial.moves[moveIndex];
      const newGame = new Chess(game.fen());
      newGame.move(move);
      setGame(newGame);
      setMoveIndex(moveIndex + 1);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Обучение шахматам
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Изучите, как ходят шахматные фигуры
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Chessboard
              position={game.fen()}
              boardWidth={600}
              customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src={currentTutorial.imageUrl}
                alt={currentTutorial.title}
                style={{ width: 50, height: 50, marginRight: 16 }}
              />
              <Typography variant="h5">
                {currentTutorial.title}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {currentTutorial.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {currentTutorial.explanation}
            </Typography>
            {currentTutorial.specialMoves && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Особые ходы:
                </Typography>
                {currentTutorial.specialMoves.map((move, index) => (
                  <Typography key={index} variant="body2" color="text.secondary" paragraph>
                    • {move}
                  </Typography>
                ))}
              </>
            )}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleMove}
                disabled={moveIndex >= currentTutorial.moves.length}
                fullWidth
              >
                Следующий ход
              </Button>
            </Box>
          </Paper>

          <Stepper activeStep={activeStep} orientation="vertical">
            {pieceTutorials.map((step, index) => (
              <Step key={step.title}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Назад
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              {activeStep === pieceTutorials.length - 1 ? 'Начать сначала' : 'Следующая фигура'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Learn; 