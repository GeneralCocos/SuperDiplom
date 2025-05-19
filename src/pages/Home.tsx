import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const GridItem = styled(Box)(({ theme }) => ({
  gridColumn: 'span 4',
  [theme.breakpoints.down('md')]: {
    gridColumn: 'span 12',
  },
}));

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        Добро пожаловать в RealDiploma
      </Typography>
      
      {isAuthenticated && (
        <Typography variant="h5" gutterBottom>
          Привет, {user?.username}!
        </Typography>
      )}

      <GridContainer>
        <GridItem>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Играйте в шахматы
            </Typography>
            <Typography>
              Сражайтесь с игроками со всего мира в режиме реального времени.
              Улучшайте свои навыки и поднимайтесь в рейтинге.
            </Typography>
          </Paper>
        </GridItem>

        <GridItem>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Учитесь
            </Typography>
            <Typography>
              Изучайте шахматные дебюты, тактики и стратегии.
              Анализируйте свои партии и учитесь на ошибках.
            </Typography>
          </Paper>
        </GridItem>

        <GridItem>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Общайтесь
            </Typography>
            <Typography>
              Присоединяйтесь к сообществу шахматистов.
              Обсуждайте партии, делитесь опытом и находите новых друзей.
            </Typography>
          </Paper>
        </GridItem>
      </GridContainer>
    </Box>
  );
};

export default Home; 