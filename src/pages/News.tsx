import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { NewsItem } from '../types/api';

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: theme.spacing(4),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(6, 1fr)',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const GridItem = styled(Box)(({ theme }) => ({
  gridColumn: 'span 4',
  [theme.breakpoints.down('lg')]: {
    gridColumn: 'span 6',
  },
  [theme.breakpoints.down('md')]: {
    gridColumn: 'span 12',
  },
}));

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get<NewsItem[]>('http://localhost:5000/api/news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Новости
      </Typography>

      <GridContainer>
        {news.map((item) => (
          <GridItem key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={item.category}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="span"
                  >
                    {new Date(item.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.content}
                </Typography>
              </CardContent>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    </Container>
  );
};

export default News; 