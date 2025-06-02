import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Определяем базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    role: 'user' | 'admin';
    username: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      const { token } = response.data;
      await login(token);
      
      // Перенаправляем на предыдущую страницу или на главную
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Вход в систему
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              Нет аккаунта? Зарегистрируйтесь
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 