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
  id: number;
  whitePlayer: User;
  blackPlayer: User;
  moves: string[];
  status: 'active' | 'completed' | 'abandoned';
  result?: 'white' | 'black' | 'draw';
  createdAt: string;
  updatedAt: string;
}

export interface AIMoveResponse {
  move: string;
  fen: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}

export interface MoveResponse {
  move: string;
  fen: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  capturedPiece?: string;
} 