import axios from 'axios';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/api/auth/login', { email, password });
    this.setToken(response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/api/auth/register', { username, email, password });
    this.setToken(response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    this.token = null;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export const authService = new AuthService(); 