import React, { useState, useEffect } from 'react';
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
  Button,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';
import { User, NewsItem } from '../types/api';

const Admin: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [newsResponse, usersResponse] = await Promise.all([
          axios.get<NewsItem[]>('http://localhost:5000/api/news', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get<User[]>('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setNews(newsResponse.data);
        setUsers(usersResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка при загрузке данных');
      }
    };

    fetchData();
  }, []);

  const handleDeleteNews = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNews(news.filter(item => item.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при удалении новости');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при удалении пользователя');
    }
  };

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

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Панель администратора
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Новости
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Заголовок</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {news.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteNews(item.id)}
                      >
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Пользователи
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Имя пользователя</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default Admin; 