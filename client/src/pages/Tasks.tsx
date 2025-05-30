import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Chessboard from '../components/ChessBoard';
import { Chess } from 'chess.js';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  fen: string;
  solution: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  progress?: {
    completed: boolean;
    attempts: number;
    pointsEarned: number;
  };
}

interface ProgressSummary {
  totalTasks: number;
  completedTasks: number;
  totalPoints: number;
  byDifficulty: {
    easy: { completed: number; total: number };
    medium: { completed: number; total: number };
    hard: { completed: number; total: number };
  };
}

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [game, setGame] = useState<Chess | null>(null);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchProgressSummary();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Ошибка при загрузке заданий');
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchProgressSummary = async () => {
    try {
      const response = await axios.get<ProgressSummary>('http://localhost:5000/api/tasks/progress/summary');
      setProgressSummary(response.data);
    } catch (error) {
      console.error('Error fetching progress summary:', error);
    }
  };

  const handleTaskSelect = (task: Task) => {
    setCurrentTask(task);
    setGame(new Chess(task.fen));
    setShowSolution(false);
    setError(null);
    setSuccess(null);
  };

  const handleMove = async (move: string) => {
    if (!game || !currentTask) return;

    try {
      const result = game.move(move);
      if (result) {
        // Проверяем решение на сервере
        const response = await axios.post<{ correct: boolean }>(`http://localhost:5000/api/tasks/${currentTask._id}/check`, {
          moves: game.history()
        });

        if (response.data.correct) {
          setSuccess('Правильное решение!');
          fetchTasks(); // Обновляем список заданий
          fetchProgressSummary(); // Обновляем прогресс
        } else {
          setError('Неправильное решение. Попробуйте еще раз.');
        }
      }
    } catch (error) {
      console.error('Error making move:', error);
      setError('Ошибка при выполнении хода');
    }
  };

  const handleSubmit = async () => {
    if (!currentTask || !game) return;

    try {
      const response = await axios.post<{ correct: boolean }>('http://localhost:5000/api/tasks/check', {
        taskId: currentTask._id,
        solution: game.history().join(' ')
      });

      if (response.data.correct) {
        setSuccess('Правильное решение!');
        fetchTasks(); // Обновляем список заданий
        fetchProgressSummary(); // Обновляем прогресс
      } else {
        setError('Неправильное решение. Попробуйте еще раз.');
      }
    } catch (error) {
      setError('Ошибка при проверке решения');
      console.error('Error checking solution:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedDifficulty !== 'all' && task.difficulty !== selectedDifficulty) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    return true;
  });

  const categories = Array.from(new Set(tasks.map(task => task.category)));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Шахматные задания
      </Typography>

      {progressSummary && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Прогресс: {progressSummary.completedTasks} / {progressSummary.totalTasks}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(progressSummary.completedTasks / progressSummary.totalTasks) * 100} 
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Очки: {progressSummary.totalPoints}</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Typography variant="body2">
                  Легкие: {progressSummary.byDifficulty.easy.completed}/{progressSummary.byDifficulty.easy.total}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">
                  Средние: {progressSummary.byDifficulty.medium.completed}/{progressSummary.byDifficulty.medium.total}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">
                  Сложные: {progressSummary.byDifficulty.hard.completed}/{progressSummary.byDifficulty.hard.total}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Фильтры
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Сложность:</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label="Все"
                  onClick={() => setSelectedDifficulty('all')}
                  color={selectedDifficulty === 'all' ? 'primary' : 'default'}
                />
                <Chip
                  label="Легкие"
                  onClick={() => setSelectedDifficulty('easy')}
                  color={selectedDifficulty === 'easy' ? 'primary' : 'default'}
                />
                <Chip
                  label="Средние"
                  onClick={() => setSelectedDifficulty('medium')}
                  color={selectedDifficulty === 'medium' ? 'primary' : 'default'}
                />
                <Chip
                  label="Сложные"
                  onClick={() => setSelectedDifficulty('hard')}
                  color={selectedDifficulty === 'hard' ? 'primary' : 'default'}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Категория:</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label="Все"
                  onClick={() => setSelectedCategory('all')}
                  color={selectedCategory === 'all' ? 'primary' : 'default'}
                />
                {categories.map(category => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} key={task._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={task.difficulty} 
                        size="small"
                        color={
                          task.difficulty === 'easy' ? 'success' :
                          task.difficulty === 'medium' ? 'warning' :
                          'error'
                        }
                      />
                      <Chip label={task.category} size="small" />
                      <Chip label={`${task.points} очков`} size="small" />
                      {task.progress?.completed && (
                        <Chip 
                          label="Выполнено" 
                          size="small" 
                          color="success"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleTaskSelect(task)}
                    >
                      {task.progress?.completed ? 'Повторить' : 'Решить'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={!!currentTask}
        onClose={() => setCurrentTask(null)}
        maxWidth="md"
        fullWidth
      >
        {currentTask && (
          <>
            <DialogTitle>{currentTask.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>}
                <Typography>{currentTask.description}</Typography>
                {game && (
                  <Box sx={{ width: '100%', maxWidth: 600 }}>
                    <Chessboard
                      position={game.fen()}
                      onMove={handleMove}
                      orientation="white"
                    />
                  </Box>
                )}
                {showSolution && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Решение:</Typography>
                    <Typography>
                      {currentTask.solution.join(' → ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSolution(!showSolution)}>
                {showSolution ? 'Скрыть решение' : 'Показать решение'}
              </Button>
              <Button onClick={() => setCurrentTask(null)}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Tasks; 