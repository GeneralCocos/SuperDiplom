import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Определяем базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    role: 'user' | 'admin';
    username: string;
  };
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token } = response.data;
      await login(token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Вход в систему</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Пароль"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Войти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal; 