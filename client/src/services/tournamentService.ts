import axios from 'axios';
import { Tournament } from '../types/api';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tournamentService = {
  async getTournaments(): Promise<Tournament[]> {
    const response = await api.get<Tournament[]>('/tournaments');
    return response.data;
  },

  async createTournament(name: string, maxParticipants: number): Promise<Tournament> {
    const response = await api.post<Tournament>('/tournaments', {
      name,
      maxParticipants
    });
    return response.data;
  },

  async joinTournament(tournamentId: string): Promise<Tournament> {
    const response = await api.post<Tournament>(`/tournaments/${tournamentId}/join`);
    return response.data;
  },

  async startTournament(tournamentId: string): Promise<Tournament> {
    const response = await api.post<Tournament>(`/tournaments/${tournamentId}/start`);
    return response.data;
  },

  async deleteTournament(tournamentId: string): Promise<void> {
    await api.delete(`/tournaments/${tournamentId}`);
  }
}; 