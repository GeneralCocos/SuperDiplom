import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import {
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { SmartToy, Person, Public } from '@mui/icons-material';
import { useGame } from '../contexts/GameContext';

const Play: React.FC = () => {
  const {
    gameType,
    playerColor,
    isPlayerTurn,
    gameOver,
    position,
    startGame,
    makeMove,
    resetGame,
  } = useGame();

  const [openDialog, setOpenDialog] = useState(!gameType);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const handleMove = (fromSquare: string, toSquare: string): boolean => {
    if (!isPlayerTurn || gameOver) {
      return false;
    }
    
    makeMove(`${fromSquare}${toSquare}`).catch(error => {
      console.error('Ошибка при выполнении хода:', error);
    });
    
    setMoveHistory(prev => [...prev, `${fromSquare}${toSquare}`]);
    return true;
  };

  const gameOptions = [
    {
      title: 'Игра против компьютера',
      description: 'Сыграйте партию против искусственного интеллекта',
      icon: <SmartToy />,
      onClick: async () => {
        try {
          await startGame('ai');
          setOpenDialog(false);
        } catch (error) {
          console.error('Ошибка при запуске игры с ИИ:', error);
        }
      },
    },
    {
      title: 'Игра на одном компьютере',
      description: 'Сыграйте партию с другом за одним компьютером',
      icon: <Person />,
      onClick: async () => {
        try {
          await startGame('human');
          setOpenDialog(false);
        } catch (error) {
          console.error('Ошибка при запуске локальной игры:', error);
        }
      },
    },
    {
      title: 'Сетевая игра',
      description: 'Сыграйте партию с другими игроками онлайн',
      icon: <Public />,
      onClick: async () => {
        try {
          await startGame('human');
          setOpenDialog(false);
        } catch (error) {
          console.error('Ошибка при запуске сетевой игры:', error);
        }
      },
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Шахматная партия
        </Typography>

        {gameOver && (
          <Typography variant="h5" color="error" align="center" gutterBottom>
            Игра завершена
          </Typography>
        )}

        {!isPlayerTurn && !gameOver && (
          <Typography variant="h6" color="info" align="center" gutterBottom>
            Ход противника...
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <div style={{ width: '600px' }}>
            <Chessboard
              position={position}
              boardOrientation={playerColor}
              onPieceDrop={handleMove}
            />
          </div>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              resetGame();
              setOpenDialog(true);
            }}
          >
            Новая игра
          </Button>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Выберите тип игры</DialogTitle>
        <DialogContent>
          <List>
            {gameOptions.map((option, index) => (
              <ListItem
                button
                onClick={option.onClick}
                key={index}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText
                  primary={option.title}
                  secondary={option.description}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Play; 