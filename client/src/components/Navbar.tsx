import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';

const Navbar: React.FC = () => {
  return (
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
            to="/learn"
          >
            Обучение
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/play-ai"
          >
            Игра с ИИ
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 