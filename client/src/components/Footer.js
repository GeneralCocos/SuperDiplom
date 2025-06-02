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
  SvgIcon,
} from '@mui/material';
import {
  Email,
  Phone,
} from '@mui/icons-material';
import TelegramIcon from '@mui/icons-material/Telegram';

// Custom VK Icon component
const VKIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2ZM18.15 16.27H16.69C16.14 16.27 15.97 15.97 14.86 14.94C13.86 14.08 13.49 13.88 13.27 13.88C12.88 13.88 12.75 14.04 12.75 14.55V15.93C12.75 16.32 12.63 16.47 11.67 16.47C10.38 16.47 9.11 15.67 8.03 14.47C6.53 12.74 5.88 11.11 5.88 10.75C5.88 10.63 5.96 10.45 6.15 10.45H7.61C7.91 10.45 8.05 10.66 8.2 11.07C8.72 12.53 9.56 13.77 9.97 13.77C10.17 13.77 10.27 13.67 10.27 13.11V11.77C10.22 10.86 10.03 10.71 10.03 10.4C10.03 10.23 10.12 10.05 10.29 9.9L10.39 9.8C10.54 9.66 10.69 9.46 10.87 9.46H13.27C13.57 9.46 13.68 9.66 13.68 9.97V12.45C13.68 12.78 13.79 12.9 13.89 12.9C14.09 12.9 14.39 12.75 14.76 12.39C15.49 11.53 16.01 10.25 16.01 9.32C16.01 9.11 16.11 8.9 16.41 8.9H17.87C18.11 8.9 18.24 9.07 18.15 9.31C17.83 10.21 16.09 12.77 16.09 12.77C15.96 13.03 15.9 13.2 16.09 13.47C16.24 13.67 16.79 14.21 17.19 14.66C18.11 15.69 18.76 16.47 18.89 16.77C19.02 17.07 18.89 17.27 18.59 17.27H18.15V16.27Z" />
  </SvgIcon>
);

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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone color="primary" />
                <Typography variant="body2" color="text.secondary">
                  +7 (999) 123-45-67
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="primary" />
                <Typography variant="body2" color="text.secondary">
                  contact@chessplatform.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <IconButton
                  aria-label="vk"
                  color="primary"
                  component="a"
                  href="https://vk.com"
                  target="_blank"
                >
                  <VKIcon />
                </IconButton>
                <IconButton
                  aria-label="telegram"
                  color="primary"
                  component="a"
                  href="https://t.me"
                  target="_blank"
                >
                  <TelegramIcon />
                </IconButton>
              </Box>
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