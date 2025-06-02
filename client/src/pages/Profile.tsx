import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Chip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import GameHistory from '../components/GameHistory';
import { PhotoCamera } from '@mui/icons-material';

// Определяем базовый URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface Friend {
  _id: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  status: 'online' | 'offline' | 'in_game';
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface AvatarResponse {
  avatarUrl: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarUrl(user.avatarUrl);
    }
    fetchAchievements();
    fetchFriends();
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get<Achievement[]>(`${API_URL}/api/achievements`);
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get<Friend[]>(`${API_URL}/api/friends`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  // Если пользователь не авторизован, показываем сообщение
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Пожалуйста, войдите в систему для просмотра профиля
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Статистика пользователя (в реальном приложении будет загружаться с сервера)
  const userStats = {
    gamesPlayed: 42,
    gamesWon: 28,
    gamesLost: 14,
    winRate: '66.7%',
    rating: 1500,
    rank: 'Средний'
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/auth/change-password', {
        oldPassword,
        newPassword
      });
      setSuccess('Пароль успешно изменен');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при смене пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const response = await axios.post<AvatarResponse>('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatarUrl(response.data.avatarUrl);
      setSuccess('Аватар успешно обновлен');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке аватара');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Информация о пользователе */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={avatarUrl}
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    cursor: 'pointer'
                  }}
                  onClick={handleAvatarClick}
                >
                  {!avatarUrl && user.username.charAt(0).toUpperCase()}
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' }
                  }}
                  onClick={handleAvatarClick}
                >
                  <PhotoCamera />
                </IconButton>
              </Box>
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <Typography color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Статистика
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Игр сыграно</Typography>
                  <Typography variant="h6">{userStats.gamesPlayed}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Победы</Typography>
                  <Typography variant="h6">{userStats.gamesWon}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Поражения</Typography>
                  <Typography variant="h6">{userStats.gamesLost}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Процент побед</Typography>
                  <Typography variant="h6">{userStats.winRate}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Настройки и история игр */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Настройки" />
                <Tab label="История игр" />
                <Tab label="Достижения" />
                <Tab label="Друзья" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Смена пароля
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              <Box component="form" onSubmit={handlePasswordChange}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Текущий пароль"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Новый пароль"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Подтвердите новый пароль"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                      Изменить пароль
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <GameHistory />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Ваши достижения
              </Typography>
              <Grid container spacing={2}>
                {achievements.map((achievement) => (
                  <Grid item xs={12} sm={6} md={4} key={achievement._id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" component="div">
                            {achievement.title}
                          </Typography>
                        </Box>
                        <Typography color="text.secondary" gutterBottom>
                          {achievement.description}
                        </Typography>
                        {achievement.unlockedAt && (
                          <Typography variant="caption" color="success.main">
                            Получено: {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Ваши друзья
              </Typography>
              <Grid container spacing={2}>
                {friends.map((friend) => (
                  <Grid item xs={12} sm={6} md={4} key={friend._id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={friend.avatarUrl}>
                            {friend.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {friend.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Рейтинг: {friend.rating}
                            </Typography>
                            <Chip
                              size="small"
                              label={friend.status === 'online' ? 'В сети' : 
                                    friend.status === 'in_game' ? 'В игре' : 'Не в сети'}
                              color={friend.status === 'online' ? 'success' : 
                                    friend.status === 'in_game' ? 'warning' : 'default'}
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 