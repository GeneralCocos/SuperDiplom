import axios from 'axios';
import { GameResponse, MoveResponse } from '../types/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const gameService = {
  async createGame(type: 'human'): Promise<GameResponse> {
    const response = await axios.post<GameResponse>(`${API_URL}/game`, { type });
    return response.data;
  },

  async makeMove(gameId: string, from: string, to: string, promotion?: string): Promise<MoveResponse> {
    const response = await axios.post<MoveResponse>(`${API_URL}/game/${gameId}/move`, {
      from,
      to,
      promotion
    });
    return response.data;
  }
}; 