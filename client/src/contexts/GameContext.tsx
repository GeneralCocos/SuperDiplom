import React, { createContext, useContext, useState, useCallback } from 'react';
import { Chess } from 'chess.js';

interface GameState {
  id: string | null;
  fen: string;
  status: 'waiting' | 'active' | 'finished';
  mode: 'ai' | 'online';
  whitePlayer: string | null;
  blackPlayer: string | null;
  currentTurn: 'white' | 'black';
  winner: 'white' | 'black' | null;
  timeLimit: number;
}

interface GameContextType {
  gameState: GameState | null;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  makeMove: (from: string, to: string) => boolean;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [game] = useState(new Chess());

  const makeMove = useCallback((from: string, to: string): boolean => {
    if (!gameState || gameState.status !== 'active') return false;

    try {
      const move = game.move({ from, to });
      if (move) {
        setGameState(prev => {
          if (!prev) return null;
          return {
            ...prev,
            fen: game.fen(),
            currentTurn: prev.currentTurn === 'white' ? 'black' : 'white',
            status: game.isGameOver() ? 'finished' : 'active',
            winner: game.isCheckmate() 
              ? (prev.currentTurn === 'white' ? 'black' : 'white')
              : null
          };
        });
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    return false;
  }, [game, gameState]);

  const resetGame = useCallback(() => {
    game.reset();
    setGameState(null);
  }, [game]);

  return (
    <GameContext.Provider value={{
      gameState,
      setGameState,
      makeMove,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 