import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Tabs,
  Tab,
  FormControl,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useTheme } from '@mui/material/styles';
import { Tournament } from '../types/api';
import { tournamentService } from '../services/tournamentService';

const Play: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [moveTime, setMoveTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(moveTime);
  const [moves, setMoves] = useState<Array<{ from: string; to: string; piece: string }>>([]);
  const [startTime] = useState(new Date());
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { socket } = useWebSocket();
  const { gameState, setGameState, makeMove, resetGame } = useGame();
  const [selectedTime, setSelectedTime] = useState<number>(20 * 60);
  const [whiteTimeLeft, setWhiteTimeLeft] = useState(selectedTime);
  const [blackTimeLeft, setBlackTimeLeft] = useState(selectedTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [localGame, setLocalGame] = useState(new Chess());
  const [isLocalGame, setIsLocalGame] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>('');
  
  // Tournament state
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [newTournamentName, setNewTournamentName] = useState('');
  const [newTournamentMaxParticipants, setNewTournamentMaxParticipants] = useState(8);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    fetchTournaments();

    // Subscribe to tournament updates
    if (socket) {
      socket.on('tournament:update', (updatedTournament: Tournament) => {
        setTournaments(prev => 
          prev.map(t => t._id === updatedTournament._id ? updatedTournament : t)
        );
      });

      socket.on('tournament:new', (newTournament: Tournament) => {
        setTournaments(prev => [...prev, newTournament]);
      });

      socket.on('tournament:delete', (tournamentId: string) => {
        setTournaments(prev => prev.filter(t => t._id !== tournamentId));
      });
    }

    return () => {
      if (socket) {
        socket.off('tournament:update');
        socket.off('tournament:new');
        socket.off('tournament:delete');
      }
    };
  }, [user, navigate, socket]);

  const fetchTournaments = async () => {
    try {
      const data = await tournamentService.getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setError('Ошибка при загрузке турниров');
    }
  };

  const createTournament = async () => {
    try {
      setError(null);
      await tournamentService.createTournament(
        newTournamentName,
        newTournamentMaxParticipants
      );
      setNewTournamentName('');
      setNewTournamentMaxParticipants(8);
    } catch (error) {
      console.error('Error creating tournament:', error);
      setError('Ошибка при создании турнира');
    }
  };

  const joinTournament = async (tournamentId: string) => {
    try {
      setError(null);
      const updatedTournament = await tournamentService.joinTournament(tournamentId);
      setTournaments(prev => 
        prev.map(t => t._id === updatedTournament._id ? updatedTournament : t)
      );
    } catch (error) {
      console.error('Error joining tournament:', error);
      setError('Ошибка при присоединении к турниру');
    }
  };

  const startTournament = async (tournamentId: string) => {
    try {
      setError(null);
      const updatedTournament = await tournamentService.startTournament(tournamentId);
      setTournaments(prev => 
        prev.map(t => t._id === updatedTournament._id ? updatedTournament : t)
      );
    } catch (error) {
      console.error('Error starting tournament:', error);
      setError('Ошибка при запуске турнира');
    }
  };

  const deleteTournament = async (tournamentId: string) => {
    try {
      setError(null);
      await tournamentService.deleteTournament(tournamentId);
      // The tournament will be removed from the list via the socket event
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setError('Ошибка при удалении турнира');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setIsWhiteTurn(true);
  };

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'waiting':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Играть
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Турниры" />
          <Tab label="Локальная игра" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Создать турнир
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <TextField
                label="Название турнира"
                value={newTournamentName}
                onChange={(e) => setNewTournamentName(e.target.value)}
              />
              <TextField
                label="Максимум участников"
                type="number"
                value={newTournamentMaxParticipants}
                onChange={(e) => setNewTournamentMaxParticipants(Number(e.target.value))}
                inputProps={{ min: 2, max: 32 }}
              />
              <Button
                variant="contained"
                onClick={createTournament}
                disabled={!newTournamentName}
              >
                Создать
              </Button>
            </Box>

            <Typography variant="h6" gutterBottom>
              Доступные турниры
            </Typography>
            <List>
              {tournaments.map((tournament) => (
                <React.Fragment key={tournament._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {tournament.name}
                          <Chip 
                            label={tournament.status} 
                            color={getStatusColor(tournament.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Создатель: {tournament.creator.username}
                          </Typography>
                          <Typography variant="body2">
                            Участники: {tournament.participants.length}/{tournament.maxParticipants}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {tournament.creator._id === user?._id && tournament.status === 'waiting' && (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => startTournament(tournament._id)}
                            disabled={tournament.participants.length < 2}
                          >
                            Начать
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteTournament(tournament._id)}
                          >
                            Удалить
                          </Button>
                        </>
                      )}
                      {tournament.status === 'waiting' && !tournament.participants.some(p => p._id === user?._id) && (
                        <Button
                          variant="contained"
                          onClick={() => joinTournament(tournament._id)}
                          disabled={tournament.participants.length >= tournament.maxParticipants}
                        >
                          Присоединиться
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Локальная игра
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Chessboard
                position={position}
                onPieceDrop={(sourceSquare, targetSquare) => {
                  const move = game.move({
                    from: sourceSquare,
                    to: targetSquare,
                    promotion: 'q'
                  });
                  if (move) {
                    setPosition(game.fen());
                    setIsWhiteTurn(!isWhiteTurn);
                    return true;
                  }
                  return false;
                }}
                boardWidth={600}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {isWhiteTurn ? 'Ход белых' : 'Ход черных'}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNewGame}
              >
                Новая игра
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Play; 