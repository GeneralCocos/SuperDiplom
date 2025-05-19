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
} from '@mui/material';
import axios from 'axios';

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

const Admin: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openNewsDialog, setOpenNewsDialog] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchNews();
    fetchUsers();
  }, []);

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Панель администратора
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Новости" />
          <Tab label="Пользователи" />
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
    </Container>
  );
};

export default Admin; 