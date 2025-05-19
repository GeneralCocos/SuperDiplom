const ChessAI = require('../ai/ChessAI');
const { Chess } = require('chess.js');

describe('ChessAI', () => {
  let ai;

  beforeEach(() => {
    ai = new ChessAI();
  });

  test('should initialize without errors', async () => {
    await expect(ai.initialize()).resolves.not.toThrow();
  });

  test('should evaluate starting position as balanced', () => {
    const chess = new Chess();
    const evaluation = ai.evaluatePosition(chess);
    expect(evaluation).toBe(0);
  });

  test('should find a valid move in starting position', async () => {
    const startingPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const move = await ai.getBestMove(startingPosition, 2);
    expect(move).toBeTruthy();
    
    const chess = new Chess(startingPosition);
    expect(() => chess.move(move)).not.toThrow();
  });

  test('should recognize checkmate position', () => {
    const checkmatePosition = 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1';
    const chess = new Chess(checkmatePosition);
    const evaluation = ai.evaluatePosition(chess);
    expect(evaluation).toBe(-1000); // Black wins
  });

  test('should recognize drawn position', () => {
    const drawnPosition = '8/8/8/8/8/8/8/k6K w - - 0 1';
    const chess = new Chess(drawnPosition);
    const evaluation = ai.evaluatePosition(chess);
    expect(evaluation).toBe(0);
  });

  test('should prefer controlling center squares', () => {
    const centerControlPosition = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    const chess = new Chess(centerControlPosition);
    const evaluation = ai.evaluatePosition(chess);
    expect(evaluation).toBeGreaterThan(0); // White has better position
  });
}); 