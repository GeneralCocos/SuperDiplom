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
        backgroundColor: (theme) => theme.palette.grey[100],
        p: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We are dedicated to providing the best chess learning experience
              with advanced AI technology and a vibrant community of players.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link
              component={RouterLink}
              to="/play"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Play Chess
            </Link>
            <Link
              component={RouterLink}
              to="/learn"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Learn
            </Link>
            <Link
              component={RouterLink}
              to="/news"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Chess News
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Connect With Us
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
          {'Copyright © '}
          <Link color="inherit" component={RouterLink} to="/">
            Chess Platform
          </Link>{' '}
          {new Date().getFullYear()}
          {'. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 