import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        p: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              О нас
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Мы стремимся предоставить лучший опыт обучения шахматам с использованием передовых технологий ИИ и активного сообщества игроков.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Быстрые ссылки
            </Typography>
            <Link
              component={RouterLink}
              to="/play"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Играть
            </Link>
            <Link
              component={RouterLink}
              to="/learning"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Обучение
            </Link>
            <Link
              component={RouterLink}
              to="/news"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Новости
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Связаться с нами
            </Typography>
            <Box>
              <IconButton
                aria-label="facebook"
                color="primary"
                component="a"
                href="https://facebook.com"
                target="_blank"
              >
                <Facebook />
              </IconButton>
              <IconButton
                aria-label="twitter"
                color="primary"
                component="a"
                href="https://twitter.com"
                target="_blank"
              >
                <Twitter />
              </IconButton>
              <IconButton
                aria-label="instagram"
                color="primary"
                component="a"
                href="https://instagram.com"
                target="_blank"
              >
                <Instagram />
              </IconButton>
              <IconButton
                aria-label="youtube"
                color="primary"
                component="a"
                href="https://youtube.com"
                target="_blank"
              >
                <YouTube />
              </IconButton>
              <IconButton
                aria-label="email"
                color="primary"
                component="a"
                href="mailto:contact@chessplatform.com"
              >
                <Email />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 3, mb: 3 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
        >
          {'© '}
          <Link color="inherit" component={RouterLink} to="/">
            Шахматная Академия
          </Link>{' '}
          {new Date().getFullYear()}
          {'. Все права защищены.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 