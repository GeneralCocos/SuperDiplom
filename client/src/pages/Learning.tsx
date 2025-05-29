import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SmartToy, Person, Public, Timer } from '@mui/icons-material';

interface Exercise {
  piece: string;
  startSquare: string;
  targetSquare: string;
  description: string;
  hint: string;
  pieceName: string;
}

const EXERCISES: Exercise[] = [
  // Пешка
  {
    piece: 'p',
    startSquare: 'e2',
    targetSquare: 'e3',
    description: 'Сделайте ход пешкой на одну клетку вперед',
    hint: 'Пешка может двигаться только вперед на одну клетку за ход',
    pieceName: 'Пешка'
  },
  {
    piece: 'p',
    startSquare: 'e2',
    targetSquare: 'e4',
    description: 'Сделайте ход пешкой на две клетки вперед',
    hint: 'Пешка может сделать первый ход на две клетки вперед',
    pieceName: 'Пешка'
  },
  // Ладья
  {
    piece: 'r',
    startSquare: 'a1',
    targetSquare: 'a4',
    description: 'Сделайте ход ладьей по вертикали',
    hint: 'Ладья может двигаться на любое количество клеток по вертикали или горизонтали',
    pieceName: 'Ладья'
  },
  {
    piece: 'r',
    startSquare: 'a1',
    targetSquare: 'd1',
    description: 'Сделайте ход ладьей по горизонтали',
    hint: 'Ладья может двигаться на любое количество клеток по вертикали или горизонтали',
    pieceName: 'Ладья'
  },
  // Конь
  {
    piece: 'n',
    startSquare: 'b1',
    targetSquare: 'c3',
    description: 'Сделайте ход конем буквой "Г" вправо',
    hint: 'Конь ходит буквой "Г": на две клетки вперед и одну в сторону',
    pieceName: 'Конь'
  },
  {
    piece: 'n',
    startSquare: 'b1',
    targetSquare: 'a3',
    description: 'Сделайте ход конем буквой "Г" влево',
    hint: 'Конь ходит буквой "Г": на две клетки вперед и одну в сторону',
    pieceName: 'Конь'
  },
  // Слон
  {
    piece: 'b',
    startSquare: 'c1',
    targetSquare: 'e3',
    description: 'Сделайте ход слоном по диагонали',
    hint: 'Слон может двигаться на любое количество клеток по диагонали',
    pieceName: 'Слон'
  },
  {
    piece: 'b',
    startSquare: 'c1',
    targetSquare: 'a3',
    description: 'Сделайте ход слоном по другой диагонали',
    hint: 'Слон может двигаться на любое количество клеток по диагонали',
    pieceName: 'Слон'
  },
  // Ферзь
  {
    piece: 'q',
    startSquare: 'd1',
    targetSquare: 'd4',
    description: 'Сделайте ход ферзем по вертикали',
    hint: 'Ферзь может двигаться на любое количество клеток по вертикали, горизонтали или диагонали',
    pieceName: 'Ферзь'
  },
  {
    piece: 'q',
    startSquare: 'd1',
    targetSquare: 'h5',
    description: 'Сделайте ход ферзем по диагонали',
    hint: 'Ферзь может двигаться на любое количество клеток по вертикали, горизонтали или диагонали',
    pieceName: 'Ферзь'
  },
  // Король
  {
    piece: 'k',
    startSquare: 'e1',
    targetSquare: 'e2',
    description: 'Сделайте ход королем на одну клетку вперед',
    hint: 'Король может двигаться на одну клетку в любом направлении',
    pieceName: 'Король'
  },
  {
    piece: 'k',
    startSquare: 'e1',
    targetSquare: 'f1',
    description: 'Сделайте ход королем на одну клетку вправо',
    hint: 'Король может двигаться на одну клетку в любом направлении',
    pieceName: 'Король'
  }
];

const Learning: React.FC = () => {
  const navigate = useNavigate();
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>(new Array(EXERCISES.length).fill(false));
  const [exerciseFeedback, setExerciseFeedback] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleExerciseMove = (from: string, to: string) => {
    const exercise = EXERCISES[currentExercise];
    if (from === exercise.startSquare && to === exercise.targetSquare) {
      const newCompleted = [...completedExercises];
      newCompleted[currentExercise] = true;
      setCompletedExercises(newCompleted);
      setExerciseFeedback('Правильно!');
      setShowHint(false);
      
      if (currentExercise < EXERCISES.length - 1) {
        setTimeout(() => {
          setCurrentExercise(prev => prev + 1);
          setExerciseFeedback('');
        }, 1500);
      } else {
        setExerciseFeedback('Поздравляем! Вы выполнили все упражнения!');
      }
    } else {
      setExerciseFeedback('Неправильный ход. Попробуйте еще раз.');
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setCompletedExercises(new Array(EXERCISES.length).fill(false));
    setExerciseFeedback('');
    setShowHint(false);
  };

  const getPieceIcon = (piece: string) => {
    switch (piece) {
      case 'p': return '♟';
      case 'r': return '♜';
      case 'n': return '♞';
      case 'b': return '♝';
      case 'q': return '♛';
      case 'k': return '♚';
      default: return '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Обучение шахматам
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Прогресс обучения
          </Typography>
          <Stepper activeStep={completedExercises.filter(Boolean).length} alternativeLabel>
            {EXERCISES.map((exercise, index) => (
              <Step key={index} completed={completedExercises[index]}>
                <StepLabel>{exercise.pieceName}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Текущее упражнение: {currentExercise + 1} из {EXERCISES.length}
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getPieceIcon(EXERCISES[currentExercise].piece)} {EXERCISES[currentExercise].pieceName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {EXERCISES[currentExercise].description}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowHint(!showHint)}
                sx={{ mt: 1 }}
              >
                {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
              </Button>
              {showHint && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {EXERCISES[currentExercise].hint}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {exerciseFeedback && (
          <Alert 
            severity={exerciseFeedback.includes('Правильно') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {exerciseFeedback}
          </Alert>
        )}

        <Box sx={{ 
          width: '100%', 
          maxWidth: 600,
          mx: 'auto',
          '& .board': {
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }
        }}>
          <Chessboard
            position="start"
            onPieceDrop={(sourceSquare, targetSquare) => {
              handleExerciseMove(sourceSquare, targetSquare);
              return true;
            }}
            boardWidth={600}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={resetExercises}
          >
            Начать заново
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/')}
          >
            Вернуться на главную
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Learning; 