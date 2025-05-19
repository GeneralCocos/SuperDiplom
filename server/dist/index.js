"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const ai_1 = require("./ai");
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const routes_1 = __importDefault(require("./routes"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/games', gameRoutes_1.default);
app.use('/api', adminRoutes_1.default);
app.use('/', routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to RealDiploma Chess Platform API' });
});
// Подключение к MongoDB
mongoose_1.default.connect('mongodb://localhost:27017/chess')
    .then(() => {
    console.log('Connected to MongoDB');
    // Initialize AI after database connection
    (0, ai_1.initializeAI)();
    console.log('AI initialized successfully');
    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch(err => console.error('MongoDB connection error:', err));
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        console.log(`User ${socket.id} joined game ${gameId}`);
    });
    socket.on('makeMove', (data) => {
        socket.to(data.gameId).emit('moveMade', data.move);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Что-то пошло не так!'
    });
});
