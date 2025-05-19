import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Шахматная Платформа
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Играйте в шахматы против ИИ или других игроков
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/play')}
            sx={{ mr: 2 }}
          >
            Начать игру
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => navigate('/learn')}
          >
            Обучение
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 