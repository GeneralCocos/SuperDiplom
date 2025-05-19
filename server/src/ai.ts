import { Chess } from 'chess.js';

export const initializeAI = () => {
  // Initialize chess engine
  const chess = new Chess();
  console.log('Chess engine initialized');
  return chess;
};
 