import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Определяем базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  author: string;
}

interface NewsFormData {
  title: string;
  content: string;
  imageUrl: string;
  category: string;
}

const News: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    imageUrl: '',
    category: 'other'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем, является ли пользователь администратором
  const isAdmin = user?.role === 'admin';

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<NewsItem[]>(`${API_URL}/api/news`);
      setNews(response.data);
    } catch (error: any) {
      console.error('Ошибка при загрузке новостей:', error);
      const errorMessage = error.response?.data?.message || 'Ошибка при загрузке новостей';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenDialog = (newsItem?: NewsItem) => {
    if (!isAdmin) {
      showSnackbar('У вас нет прав для редактирования новостей', 'error');
      return;
    }

    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        imageUrl: newsItem.imageUrl,
        category: newsItem.category,
      });
    } else {
      setEditingNews(null);
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        category: 'other'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      category: 'other'
    });
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSubmit = async () => {
    if (!isAdmin) {
      showSnackbar('У вас нет прав для редактирования новостей', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showSnackbar('Необходима авторизация', 'error');
      navigate('/login');
      return;
    }

    try {
      const newsData = {
        ...formData,
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Chess+News'
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (editingNews) {
        await axios.put(`${API_URL}/api/news/${editingNews._id}`, newsData, config);
        showSnackbar('Новость успешно обновлена', 'success');
      } else {
        await axios.post(`${API_URL}/api/news`, newsData, config);
        showSnackbar('Новость успешно создана', 'success');
      }
      handleCloseDialog();
      fetchNews();
    } catch (error: any) {
      console.error('Ошибка при сохранении новости:', error);
      if (error.response?.status === 401) {
        showSnackbar('Необходима авторизация', 'error');
        navigate('/login');
      } else if (error.response?.status === 403) {
        showSnackbar('У вас нет прав для выполнения этого действия', 'error');
      } else {
        const errorMessage = error.response?.data?.message || 'Ошибка при сохранении новости';
        showSnackbar(errorMessage, 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      showSnackbar('У вас нет прав для удаления новостей', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showSnackbar('Необходима авторизация', 'error');
      navigate('/login');
      return;
    }

    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await axios.delete(`${API_URL}/api/news/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        showSnackbar('Новость успешно удалена', 'success');
        fetchNews();
      } catch (error: any) {
        console.error('Ошибка при удалении новости:', error);
        if (error.response?.status === 401) {
          showSnackbar('Необходима авторизация', 'error');
          navigate('/login');
        } else {
          showSnackbar('Ошибка при удалении новости', 'error');
        }
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Шахматные новости
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Последние события в мире шахмат
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Загрузка новостей...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : news.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Новостей пока нет</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {news.map((item) => (
            <Grid item xs={12} md={6} key={item._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.title}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {item.title}
                    </Typography>
                    {isAdmin && (
                      <Box>
                        <IconButton onClick={() => handleOpenDialog(item)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item._id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.createdAt).toLocaleDateString('ru-RU')} • {item.author}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {isAdmin && (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Добавить новость
          </Button>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingNews ? 'Редактировать новость' : 'Добавить новость'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Заголовок"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            label="Содержание"
            fullWidth
            multiline
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            label="URL изображения"
            fullWidth
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            autoComplete="off"
          />
          <TextField
            select
            margin="dense"
            label="Категория"
            fullWidth
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            SelectProps={{
              native: true,
            }}
            autoComplete="off"
          >
            <option value="tournament">Турниры</option>
            <option value="player">Игроки</option>
            <option value="other">Другое</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingNews ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default News; 