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

export interface MoveResponse {
  position: string;
  gameOver: boolean;
}

export interface Tournament {
  _id: string;
  name: string;
  creator: {
    _id: string;
    username: string;
  };
  participants: Array<{
    _id: string;
    username: string;
  }>;
  maxParticipants: number;
  status: 'waiting' | 'in_progress' | 'completed';
  startTime?: Date;
  endTime?: Date;
  winner?: {
    _id: string;
    username: string;
  };
  rounds: Array<{
    number: number;
    matches: Array<{
      whitePlayer: {
        _id: string;
        username: string;
      };
      blackPlayer: {
        _id: string;
        username: string;
      };
      result: 'white' | 'black' | 'draw' | 'pending';
      moves: Array<{
        from: string;
        to: string;
        promotion?: string;
      }>;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
} 