import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Определяем базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface News {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

const AdminNews: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [open, setOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchNews();
  }, [user, navigate]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходима авторизация');
        navigate('/login');
        return;
      }

      const response = await axios.get<News[]>(`${API_URL}/api/news`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNews(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Необходима авторизация');
        navigate('/login');
      } else {
        setError('Ошибка при загрузке новостей');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (news?: News) => {
    if (news) {
      setEditingNews(news);
      setFormData({
        title: news.title,
        content: news.content,
        imageUrl: news.imageUrl
      });
    } else {
      setEditingNews(null);
      setFormData({
        title: '',
        content: '',
        imageUrl: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      imageUrl: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходима авторизация');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (editingNews) {
        await axios.put(`${API_URL}/api/news/${editingNews._id}`, formData, config);
        setSuccess('Новость обновлена');
      } else {
        await axios.post(`${API_URL}/api/news`, formData, config);
        setSuccess('Новость создана');
      }
      handleClose();
      fetchNews();
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Необходима авторизация');
        navigate('/login');
      } else {
        setError('Ошибка при сохранении новости');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Необходима авторизация');
          navigate('/login');
          return;
        }

        await axios.delete(`${API_URL}/api/news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSuccess('Новость удалена');
        fetchNews();
      } catch (error: any) {
        if (error.response?.status === 401) {
          setError('Необходима авторизация');
          navigate('/login');
        } else {
          setError('Ошибка при удалении новости');
        }
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Доступ запрещен. Требуются права администратора.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Управление новостями
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Добавить новость
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {news.map((item) => (
          <Grid item xs={12} key={item._id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>{item.content}</Typography>
                  {item.imageUrl && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    </Box>
                  )}
                </Box>
                <Box>
                  <IconButton onClick={() => handleOpen(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNews ? 'Редактировать новость' : 'Добавить новость'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Заголовок"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Содержание"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="URL изображения"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingNews ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminNews; 