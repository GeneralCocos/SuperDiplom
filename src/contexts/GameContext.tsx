import React, { createContext, useContext, useState } from 'react';
import { GameResponse, AIMoveResponse } from '../types/api';
import { gameService } from '../services/gameService';

interface GameContextType {
  gameId: string | null;
  gameType: 'ai' | 'human' | null;
  playerColor: 'white' | 'black' | null;
  position: string;
  isPlayerTurn: boolean;
  gameOver: boolean;
  startGame: (type: 'ai' | 'human') => Promise<void>;
  makeMove: (from: string, to: string, promotion?: string) => Promise<void>;
  getAIMove: () => Promise<void>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameType, setGameType] = useState<'ai' | 'human' | null>(null);
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
  const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const startGame = async (type: 'ai' | 'human') => {
    try {
      const response = await gameService.createGame(type);
      const { gameId: newGameId, color } = response as GameResponse;
      setGameId(newGameId);
      setGameType(type);
      setPlayerColor(color);
      setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      setIsPlayerTurn(color === 'white');
      setGameOver(false);
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  };

  const makeMove = async (from: string, to: string, promotion?: string) => {
    if (!gameId || !isPlayerTurn) return;

    try {
      const response = await gameService.makeMove(gameId, from, to, promotion);
      setPosition(response.position);
      setIsPlayerTurn(false);

      if (response.gameOver) {
        setGameOver(true);
      } else if (gameType === 'ai') {
        await getAIMove();
      }
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  };

  const getAIMove = async () => {
    if (!gameId || isPlayerTurn) return;

    try {
      const response = await gameService.getAIMove(position);
      const aiMove = response as AIMoveResponse;
      setPosition(aiMove.position);
      setIsPlayerTurn(true);
      
      if (aiMove.gameOver) {
        setGameOver(true);
      }
    } catch (error) {
      console.error('Error getting AI move:', error);
      throw error;
    }
  };

  const resetGame = () => {
    setGameId(null);
    setGameType(null);
    setPlayerColor(null);
    setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    setIsPlayerTurn(true);
    setGameOver(false);
  };

  return (
    <GameContext.Provider
      value={{
        gameId,
        gameType,
        playerColor,
        position,
        isPlayerTurn,
        gameOver,
        startGame,
        makeMove,
        getAIMove,
        resetGame
      }}
    >
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