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
  Alert
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { AuthResponse } from '../types/api';

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: theme.spacing(2),
}));

const GridItem = styled(Box)(({ theme }) => ({
  gridColumn: 'span 12',
  [theme.breakpoints.up('sm')]: {
    '&.half': {
      gridColumn: 'span 6',
    },
  },
}));

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Пароли не совпадают');
    }

    try {
      setLoading(true);
      const response = await axios.post<AuthResponse>('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      login(response.data.token);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Регистрация
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <GridContainer>
            <GridItem>
              <TextField
                label="Имя пользователя"
                name="username"
                fullWidth
                required
                value={formData.username}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem className="half">
              <TextField
                label="Имя"
                name="firstName"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem className="half">
              <TextField
                label="Фамилия"
                name="lastName"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem>
              <TextField
                label="Пароль"
                name="password"
                type="password"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem>
              <TextField
                label="Подтвердите пароль"
                name="confirmPassword"
                type="password"
                fullWidth
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </GridItem>
          </GridContainer>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Уже есть аккаунт?{' '}
            <Link component={RouterLink} to="/login">
              Войти
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 