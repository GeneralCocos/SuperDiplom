export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    gamesDrawn: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameResponse {
  gameId: string;
  color: 'white' | 'black';
  position: string;
  gameOver: boolean;
}

export interface AIMoveResponse {
  move: string;
  fen: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}

export interface MoveResponse {
  position: string;
  gameOver: boolean;
} 