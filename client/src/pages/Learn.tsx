import React, { useState, useEffect } from 'react';
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
import PieceLearning from '../components/PieceLearning';

const pieces = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'] as const;

const Learn: React.FC = () => {
  const [activePiece, setActivePiece] = useState<typeof pieces[number]>('pawn');
  const [completedPieces, setCompletedPieces] = useState<Set<string>>(new Set());

  const handlePieceComplete = () => {
    setCompletedPieces(prev => new Set([...Array.from(prev), activePiece]));
    
    // Move to next piece if not all completed
    const currentIndex = pieces.indexOf(activePiece);
    if (currentIndex < pieces.length - 1) {
      setTimeout(() => {
        setActivePiece(pieces[currentIndex + 1]);
      }, 1500);
    }
  };

  const totalProgress = (completedPieces.size / pieces.length) * 100;

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
            <PieceLearning
              piece={activePiece}
              onComplete={handlePieceComplete}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Прогресс обучения
            </Typography>
            <Stepper orientation="vertical" activeStep={completedPieces.size}>
              {pieces.map((piece, index) => (
                <Step key={piece} completed={completedPieces.has(piece)}>
                  <StepLabel>
                    {piece.charAt(0).toUpperCase() + piece.slice(1)}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Learn; 