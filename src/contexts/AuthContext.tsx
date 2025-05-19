import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, AuthResponse } from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  register: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get<User>('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    fetchUserProfile(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (username: string, email: string, password: string, firstName?: string, lastName?: string) => {
    const response = await axios.post<AuthResponse>('http://localhost:5000/api/auth/register', {
      username,
      email,
      password,
      firstName,
      lastName
    });
    login(response.data.token);
  };

  const updateUser = async (userData: Partial<User>) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await axios.put<User>('http://localhost:5000/api/auth/profile', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(response.data as User);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUser }}>
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