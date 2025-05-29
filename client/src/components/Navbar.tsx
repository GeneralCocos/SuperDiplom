import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Шахматная Академия
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/learning"
            >
              Обучение
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/play"
            >
              Играть
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/news"
            >
              Новости
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                >
                  Личный кабинет
                </Button>
                <Button
                  color="inherit"
                  onClick={logout}
                >
                  Выход
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => setLoginModalOpen(true)}
                >
                  Вход
                </Button>
                <Button
                  color="inherit"
                  onClick={() => setRegisterModalOpen(true)}
                >
                  Регистрация
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </>
  );
};

export default Navbar; 