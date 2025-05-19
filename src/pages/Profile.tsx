import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types/api';

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const GridItem = styled(Box)(({ theme }) => ({
  gridColumn: 'span 6',
  [theme.breakpoints.down('md')]: {
    gridColumn: 'span 12',
  },
}));

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<UserProfile>('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(response.data);
        setFormData(prev => ({
          ...prev,
          username: response.data.username,
          email: response.data.email
        }));
        setStats(response.data.stats);
      } catch (err) {
        setError('Ошибка при загрузке профиля');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          username: formData.username,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess('Профиль успешно обновлен');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={profile.avatar}
            alt={profile.username}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4" component="h1">
              {profile.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Рейтинг: {profile.rating}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Имя пользователя"
                name="username"
                fullWidth
                required
                margin="normal"
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                label="Текущий пароль"
                name="currentPassword"
                type="password"
                fullWidth
                required
                margin="normal"
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <TextField
                label="Новый пароль"
                name="newPassword"
                type="password"
                fullWidth
                margin="normal"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <TextField
                label="Подтвердите новый пароль"
                name="confirmPassword"
                type="password"
                fullWidth
                margin="normal"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Обновление...' : 'Обновить профиль'}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Статистика игр
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">
                  Всего игр: {stats.gamesPlayed}
                </Typography>
                <Typography variant="body1">
                  Победы: {stats.gamesWon}
                </Typography>
                <Typography variant="body1">
                  Поражения: {stats.gamesLost}
                </Typography>
                <Typography variant="body1">
                  Ничьи: {stats.gamesDrawn}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 