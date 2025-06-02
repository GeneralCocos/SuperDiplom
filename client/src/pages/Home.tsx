import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SportsEsportsIcon sx={{ fontSize: 40 }} />,
      title: 'Играйте онлайн',
      description: 'Сражайтесь с игроками со всего мира или играйте против нашего ИИ'
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Учитесь шахматам',
      description: 'Интерактивные уроки и задачи для всех уровней подготовки'
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: 'Участвуйте в турнирах',
      description: 'Регулярные турниры с призами и рейтинговой системой'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Шахматная Платформа
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Играйте в шахматы против ИИ или других игроков
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/play')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                Начать игру
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/learning')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Обучение
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 8,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Готовы начать свое шахматное путешествие?
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
              Присоединяйтесь к нашему сообществу и развивайте свои навыки
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 