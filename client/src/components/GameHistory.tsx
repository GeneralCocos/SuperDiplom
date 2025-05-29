import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Game {
  _id: string;
  whitePlayer: {
    username: string;
  };
  blackPlayer: {
    username: string;
  };
  result: 'white' | 'black' | 'draw';
  gameType: 'local' | 'online' | 'ai';
  startTime: string;
  endTime: string;
  timeControl: number;
}

const GameHistory: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await axios.get<Game[]>('/api/game-history');
        setGames(response.data);
      } catch (err) {
        setError('Ошибка при загрузке истории игр');
        console.error('Error fetching game history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, []);

  const getResultColor = (result: string) => {
    switch (result) {
      case 'white':
        return 'success';
      case 'black':
        return 'error';
      case 'draw':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeControl = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} мин`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        История игр
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Тип игры</TableCell>
              <TableCell>Белые</TableCell>
              <TableCell>Черные</TableCell>
              <TableCell>Результат</TableCell>
              <TableCell>Контроль времени</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game._id}>
                <TableCell>{formatDate(game.startTime)}</TableCell>
                <TableCell>
                  <Chip
                    label={game.gameType === 'ai' ? 'Игра с ИИ' : game.gameType === 'online' ? 'Онлайн' : 'Локальная'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{game.whitePlayer.username}</TableCell>
                <TableCell>{game.blackPlayer.username}</TableCell>
                <TableCell>
                  <Chip
                    label={game.result === 'white' ? 'Победа белых' : game.result === 'black' ? 'Победа черных' : 'Ничья'}
                    color={getResultColor(game.result)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatTimeControl(game.timeControl)}</TableCell>
              </TableRow>
            ))}
            {games.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">
                    История игр пуста
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GameHistory; 