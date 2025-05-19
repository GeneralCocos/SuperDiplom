import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const Game = () => {
  const { gameId } = useParams();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Game {gameId}
        </Typography>
        {/* Chess board will be added here */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography>Chess board coming soon...</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Game; 