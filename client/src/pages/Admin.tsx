import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  fen: string;
  solution: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openNewsDialog, setOpenNewsDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    fen: '',
    solution: [''],
    difficulty: 'easy',
    category: '',
    points: 10,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchNews();
    fetchUsers();
    fetchTasks();
  }, [user, navigate]);

  const fetchNews = async () => {
    try {
      const response = await axios.get<NewsItem[]>('http://localhost:5000/api/news');
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Ошибка при загрузке заданий');
    }
  };

  const handleAddNews = async () => {
    try {
      await axios.post('http://localhost:5000/api/news', newNews);
      setOpenNewsDialog(false);
      setNewNews({ title: '', content: '', imageUrl: '' });
      fetchNews();
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask);
      setOpenTaskDialog(false);
      setNewTask({
        title: '',
        description: '',
        fen: '',
        solution: [''],
        difficulty: 'easy',
        category: '',
        points: 10,
      });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Ошибка при добавлении задания');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Ошибка при удалении задания');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Панель администратора
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Новости" />
          <Tab label="Пользователи" />
          <Tab label="Задания" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => setOpenNewsDialog(true)}
            >
              Добавить новость
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Заголовок</TableCell>
                  <TableCell>Автор</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => handleDeleteNews(item._id)}
                      >
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Имя пользователя</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell>Дата регистрации</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleUpdateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                      >
                        {user.role === 'admin' ? 'Сделать пользователем' : 'Сделать администратором'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => setOpenTaskDialog(true)}
            >
              Добавить задание
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Сложность</TableCell>
                  <TableCell>Категория</TableCell>
                  <TableCell>Очки</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.difficulty}</TableCell>
                    <TableCell>{task.category}</TableCell>
                    <TableCell>{task.points}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      <Dialog open={openNewsDialog} onClose={() => setOpenNewsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить новость</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Заголовок"
            fullWidth
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Содержание"
            fullWidth
            multiline
            rows={4}
            value={newNews.content}
            onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL изображения"
            fullWidth
            value={newNews.imageUrl}
            onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewsDialog(false)}>Отмена</Button>
          <Button onClick={handleAddNews} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить задание</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={2}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="FEN"
            fullWidth
            value={newTask.fen}
            onChange={(e) => setNewTask({ ...newTask, fen: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Решение"
            fullWidth
            value={newTask.solution.join(' ')}
            onChange={(e) => setNewTask({ ...newTask, solution: e.target.value.split(' ') })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Сложность</InputLabel>
            <Select
              value={newTask.difficulty}
              label="Сложность"
              onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            >
              <MenuItem value="easy">Легкое</MenuItem>
              <MenuItem value="medium">Среднее</MenuItem>
              <MenuItem value="hard">Сложное</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Категория"
            fullWidth
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Очки"
            type="number"
            fullWidth
            value={newTask.points}
            onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Отмена</Button>
          <Button onClick={handleAddTask} variant="contained">Добавить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin; 