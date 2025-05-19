const request = require('supertest');
const express = require('express');
const { getAIMove, evaluatePosition } = require('../controllers/aiController');

const app = express();
app.use(express.json());

// Mock routes
app.post('/api/ai/move', getAIMove);
app.post('/api/ai/evaluate', evaluatePosition);

describe('AI Controller', () => {
  test('should return a valid move for a given position', async () => {
    const response = await request(app)
      .post('/api/ai/move')
      .send({
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        difficulty: 'easy'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('move');
    expect(response.body).toHaveProperty('position');
    expect(response.body).toHaveProperty('gameOver');
    expect(response.body).toHaveProperty('inCheck');
    expect(response.body).toHaveProperty('isCheckmate');
    expect(response.body).toHaveProperty('isStalemate');
  });

  test('should handle invalid FEN string', async () => {
    const response = await request(app)
      .post('/api/ai/move')
      .send({
        fen: 'invalid fen string',
        difficulty: 'easy'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should handle missing FEN string', async () => {
    const response = await request(app)
      .post('/api/ai/move')
      .send({
        difficulty: 'easy'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('FEN position is required');
  });

  test('should evaluate a position', async () => {
    const response = await request(app)
      .post('/api/ai/evaluate')
      .send({
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(typeof response.body.evaluation).toBe('number');
  });

  test('should handle game over position', async () => {
    const response = await request(app)
      .post('/api/ai/move')
      .send({
        fen: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1',
        difficulty: 'easy'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Game is already over');
  });
}); 