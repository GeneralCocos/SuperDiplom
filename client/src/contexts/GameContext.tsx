import React, { createContext, useContext, useState, useEffect } from 'react';
import gameService from '../services/gameService';

interface GameMove {
  position: string;
  gameOver?: boolean;
}

interface GameResponse {
  gameId: string;
  color: 'white' | 'black';
}

interface GameContextType {
  gameId: string | null;
  gameType: 'ai' | 'human' | null;
  playerColor: 'white' | 'black';
  isPlayerTurn: boolean;
  gameOver: boolean;
  position: string;
  startGame: (type: 'ai' | 'human') => Promise<void>;
  makeMove: (move: string) => Promise<void>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameType, setGameType] = useState<'ai' | 'human' | null>(null);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  useEffect(() => {
    if (gameType === 'human') {
      const socket = gameService.connect();

      socket.on('move_made', (data: GameMove) => {
        setPosition(data.position);
        setIsPlayerTurn(true);
      });

      socket.on('game_over', () => {
        setGameOver(true);
      });

      return () => {
        gameService.disconnect();
      };
    }
  }, [gameType]);

  const startGame = async (type: 'ai' | 'human') => {
    try {
      const response = await gameService.createGame(type) as GameResponse;
      setGameId(response.gameId);
      setGameType(type);
      setPlayerColor(response.color);
      setIsPlayerTurn(response.color === 'white');
      setGameOver(false);
      setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

      if (type === 'human') {
        gameService.joinGame(response.gameId);
      }
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  };

  const makeMove = async (move: string) => {
    if (gameType === 'ai') {
      setIsPlayerTurn(false);
      try {
        const aiMove = await gameService.getAIMove(position) as GameMove;
        setPosition(aiMove.position);
        setIsPlayerTurn(true);
        
        if (aiMove.gameOver) {
          setGameOver(true);
        }
      } catch (error) {
        console.error('Error making AI move:', error);
        setIsPlayerTurn(true);
      }
    } else if (gameType === 'human' && gameId) {
      gameService.makeMove(gameId, move);
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setGameId(null);
    setGameType(null);
    setPlayerColor('white');
    setIsPlayerTurn(true);
    setGameOver(false);
    setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  };

  return (
    <GameContext.Provider
      value={{
        gameId,
        gameType,
        playerColor,
        isPlayerTurn,
        gameOver,
        position,
        startGame,
        makeMove,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 