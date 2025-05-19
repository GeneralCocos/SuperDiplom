import io from 'socket.io-client';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class GameService {
  private socket: ReturnType<typeof io> | null = null;

  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(API_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to game server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinGame(gameId: string) {
    if (this.socket) {
      this.socket.emit('join_game', gameId);
    }
  }

  makeMove(gameId: string, move: any) {
    if (this.socket) {
      this.socket.emit('make_move', { gameId, move });
    }
  }

  async getAIMove(fen: string, difficulty: string = 'easy') {
    try {
      const response = await axios.post(`${API_URL}/api/chess/ai-move`, {
        fen,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('Error getting AI move:', error);
      throw error;
    }
  }

  async createGame(type: 'ai' | 'human') {
    try {
      const response = await axios.post(`${API_URL}/api/games`, {
        type
      });
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async getGameHistory(userId: string) {
    try {
      const response = await axios.get(`${API_URL}/api/games/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game history:', error);
      throw error;
    }
  }

  onMoveMade(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('move_made', callback);
    }
  }

  onGameOver(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('game_over', callback);
    }
  }
}

export default new GameService(); 