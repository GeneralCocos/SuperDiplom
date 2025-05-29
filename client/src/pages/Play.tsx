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
  FormControl
} from '@mui/material';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useTheme } from '@mui/material/styles';

interface AIMoveResponse {
  move: string;
  fen: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Play: React.FC = () => {
  const [game] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [moveTime, setMoveTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(moveTime);
  const [moves, setMoves] = useState<Array<{ from: string; to: string; piece: string }>>([]);
  const [startTime] = useState(new Date());
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isAiThinking, setIsAiThinking] = useState(false);
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setInterval(() => {
        if (currentPlayer === 'white') {
          setWhiteTimeLeft(prev => {
            if (prev <= 0) {
              handleTimeUp('white');
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackTimeLeft(prev => {
            if (prev <= 0) {
              handleTimeUp('black');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTimerRunning, currentPlayer]);

  const makeAiMove = async () => {
    if (gameOver) return;

    setIsAiThinking(true);
    try {
      const response = await axios.post<AIMoveResponse>('/api/ai/move', {
        fen: game.fen(),
        difficulty: aiDifficulty
      });

      const { move, fen } = response.data;
      const [from, to] = move.split('-');
      const piece = game.get(from as any);

      if (piece) {
        const moveResult = game.move({ from, to, promotion: 'q' });
        if (moveResult) {
          setMoves(prev => [...prev, { from, to, piece: piece.type }]);
          setPosition(fen);
          setIsWhiteTurn(true);
          setTimeLeft(moveTime);
          setCurrentPlayer('white');
          setIsTimerRunning(false);

          if (game.isGameOver()) {
            setGameOver(true);
            saveGameHistory();
          }
        }
      }
    } catch (error) {
      console.error('Error making AI move:', error);
    } finally {
      setIsAiThinking(false);
    }
  };

  const saveGameHistory = async () => {
    if (!user) return;

    try {
      const gameData = {
        whitePlayer: user._id,
        blackPlayer: user._id,
        moves,
        result: game.isCheckmate() 
          ? (isWhiteTurn ? 'black' : 'white')
          : game.isDraw() 
            ? 'draw'
            : 'draw',
        gameType: 'standard',
        startTime,
        endTime: new Date(),
        timeControl: selectedTime / 60
      };

      await axios.post('/api/game-history', gameData);
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  };

  const handleMove = (fromSquare: string, toSquare: string): boolean => {
    try {
      const piece = game.get(fromSquare as any);
      if (!piece) return false;

      const move = game.move({
        from: fromSquare,
        to: toSquare,
        promotion: 'q'
      });

      if (move === null) return false;

      setMoves(prev => [...prev, { from: fromSquare, to: toSquare, piece: piece.type }]);
      setPosition(game.fen());
      setIsWhiteTurn(false);
      setTimeLeft(moveTime);
      setCurrentPlayer('black');
      setIsTimerRunning(false);

      if (game.isGameOver()) {
        setGameOver(true);
        saveGameHistory();
      }

      return true;
    } catch (error) {
      console.error('Error making player move:', error);
      return false;
    }
  };

  const handleTimeUp = (player: 'white' | 'black') => {
    setIsTimerRunning(false);
    setGameStatus(`Время истекло! Победа ${player === 'white' ? 'черных' : 'белых'}`);
    setGameOver(true);
  };

  const checkGameStatus = () => {
    if (localGame.isCheckmate()) {
      setGameStatus(`Шах и мат! Победа ${currentPlayer === 'white' ? 'черных' : 'белых'}`);
      setGameOver(true);
      setIsTimerRunning(false);
    } else if (localGame.isDraw()) {
      if (localGame.isStalemate()) {
        setGameStatus('Пат! Ничья');
      } else if (localGame.isThreefoldRepetition()) {
        setGameStatus('Троекратное повторение позиции! Ничья');
      } else if (localGame.isInsufficientMaterial()) {
        setGameStatus('Недостаточно материала! Ничья');
      } else {
        setGameStatus('Ничья');
      }
      setGameOver(true);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 1) {
      setIsLocalGame(true);
      setLocalGame(new Chess());
      setCurrentPlayer('white');
    } else {
      setIsLocalGame(false);
    }
  };

  const handleLocalDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const move = localGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move === null) return false;
      
      setLocalGame(new Chess(localGame.fen()));
      setIsTimerRunning(false);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      setIsTimerRunning(true);
      checkGameStatus();
      return true;
    } catch (error) {
      return false;
    }
  };

  const startNewGame = () => {
    setLocalGame(new Chess());
    setCurrentPlayer('white');
    setGameOver(false);
    setGameStatus('');
    setWhiteTimeLeft(selectedTime);
    setBlackTimeLeft(selectedTime);
    setIsTimerRunning(true);
  };

  const handleTimeSelect = (minutes: number) => {
    setSelectedTime(minutes * 60);
    setWhiteTimeLeft(minutes * 60);
    setBlackTimeLeft(minutes * 60);
  };

  const renderTimerControls = () => (
    <Box sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Время на партию</FormLabel>
        <RadioGroup
          row
          value={selectedTime / 60}
          onChange={(e) => handleTimeSelect(Number(e.target.value))}
        >
          <FormControlLabel
            value={5}
            control={<Radio />}
            label="5 минут"
            disabled={isTimerRunning}
          />
          <FormControlLabel
            value={20}
            control={<Radio />}
            label="20 минут"
            disabled={isTimerRunning}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );

  const renderTimers = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      width: '100%', 
      maxWidth: 600,
      mb: 2 
    }}>
      <Paper sx={{ p: 2, bgcolor: currentPlayer === 'white' ? 'primary.light' : 'background.paper' }}>
        <Typography variant="h6">Белые</Typography>
        <Typography variant="h4">{formatTime(whiteTimeLeft)}</Typography>
      </Paper>
      <Paper sx={{ p: 2, bgcolor: currentPlayer === 'black' ? 'primary.light' : 'background.paper' }}>
        <Typography variant="h6">Черные</Typography>
        <Typography variant="h4">{formatTime(blackTimeLeft)}</Typography>
      </Paper>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Игра с ИИ" />
          <Tab label="Игра 1 на 1" />
          <Tab label="Игра онлайн" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" gutterBottom>
              Игра с ИИ
            </Typography>
            {!gameOver && renderTimerControls()}
            {renderTimers()}
            {gameStatus && (
              <Alert severity={gameStatus.includes('Ничья') ? 'info' : 'success'} sx={{ width: '100%', maxWidth: 600 }}>
                {gameStatus}
              </Alert>
            )}
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <Chessboard
                position={gameState?.fen || 'start'}
                onPieceDrop={(sourceSquare, targetSquare) => {
                  const move = makeMove(sourceSquare, targetSquare);
                  return move;
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={startNewGame}
                sx={{ mr: 2 }}
              >
                Новая игра
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/')}
              >
                Вернуться на главную
              </Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" gutterBottom>
              Игра 1 на 1
            </Typography>
            {!gameOver && renderTimerControls()}
            {renderTimers()}
            {gameStatus && (
              <Alert severity={gameStatus.includes('Ничья') ? 'info' : 'success'} sx={{ width: '100%', maxWidth: 600 }}>
                {gameStatus}
              </Alert>
            )}
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <Chessboard
                position={localGame.fen()}
                onPieceDrop={handleLocalDrop}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={startNewGame}
                sx={{ mr: 2 }}
              >
                Новая игра
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/')}
              >
                Вернуться на главную
              </Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" gutterBottom>
              Игра онлайн
            </Typography>
            {!isAuthenticated ? (
              <Alert severity="warning" sx={{ width: '100%', maxWidth: 600 }}>
                Для игры онлайн необходимо войти в систему
              </Alert>
            ) : (
              <>
                {!gameOver && renderTimerControls()}
                {renderTimers()}
                {gameStatus && (
                  <Alert severity={gameStatus.includes('Ничья') ? 'info' : 'success'} sx={{ width: '100%', maxWidth: 600 }}>
                    {gameStatus}
                  </Alert>
                )}
                <Box sx={{ width: '100%', maxWidth: 600 }}>
                  <Chessboard
                    position={gameState?.fen || 'start'}
                    onPieceDrop={(sourceSquare, targetSquare) => {
                      if (socket) {
                        socket.emit('move', { from: sourceSquare, to: targetSquare });
                        return true;
                      }
                      return false;
                    }}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => socket?.emit('findGame')}
                    sx={{ mr: 2 }}
                  >
                    Найти игру
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/')}
                  >
                    Вернуться на главную
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Play; 