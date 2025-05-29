import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Game {
  _id: string;
  whitePlayer: string;
  blackPlayer: string;
  result: string;
  startTime: string;
  endTime: string;
  moves: Array<{ from: string; to: string; piece: string }>;
}

interface GameHistoryResponse {
  data: Game[];
}

const GameHistory: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get<Game[]>('/api/game-history');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };

    fetchGames();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'white':
        return 'Победа белых';
      case 'black':
        return 'Победа черных';
      case 'draw':
        return 'Ничья';
      default:
        return result;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          История игр
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Белые</TableCell>
                <TableCell>Черные</TableCell>
                <TableCell>Результат</TableCell>
                <TableCell>Количество ходов</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game._id}>
                  <TableCell>{formatDate(game.startTime)}</TableCell>
                  <TableCell>
                    {game.whitePlayer === user?._id ? 'Вы' : 'Противник'}
                  </TableCell>
                  <TableCell>
                    {game.blackPlayer === user?._id ? 'Вы' : 'Противник'}
                  </TableCell>
                  <TableCell>{getResultText(game.result)}</TableCell>
                  <TableCell>{game.moves.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {games.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              У вас пока нет сыгранных игр
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default GameHistory; 