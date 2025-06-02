require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const newsRoutes = require('./routes/news');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const tournamentRoutes = require('./routes/tournaments');
const achievementRoutes = require('./routes/achievements');
const friendRoutes = require('./routes/friends');

const app = express();
const httpServer = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io setup
const io = new Server(httpServer, {
  cors: corsOptions
});

// Make io accessible to routes
app.set('io', io);

// Socket.io middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  // Here you would verify the token
  // For now, we'll just pass the token through
  socket.user = { token };
  next();
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/friends', friendRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chess')
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 