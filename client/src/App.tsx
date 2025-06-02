import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Play from './pages/Play';
import Learning from './pages/Learning';
import Tasks from './pages/Tasks';
import News from './pages/News';
import AdminNews from './pages/AdminNews';
import GameHistory from './pages/GameHistory';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WebSocketProvider>
          <GameProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/play"
                  element={
                    <PrivateRoute>
                      <Play />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/learning"
                  element={
                    <PrivateRoute>
                      <Learning />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tasks"
                  element={
                    <PrivateRoute>
                      <Tasks />
                    </PrivateRoute>
                  }
                />
                <Route path="/news" element={<News />} />
                <Route
                  path="/admin/news"
                  element={
                    <PrivateRoute requireAdmin>
                      <AdminNews />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PrivateRoute>
                      <GameHistory />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </GameProvider>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 