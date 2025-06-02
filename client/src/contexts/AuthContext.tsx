import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Определяем базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface User {
  _id: string;
  email: string;
  role: 'user' | 'admin';
  username: string;
  avatarUrl?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Настройка axios для автоматического добавления токена к запросам
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Добавляем перехватчик ответов для обработки ошибок аутентификации
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    try {
      const response = await axios.get<User>(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const user = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/register`, {
        email,
        password,
        username
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.replace('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 