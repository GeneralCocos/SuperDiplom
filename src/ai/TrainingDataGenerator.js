const Chess = require('chess.js');
const fs = require('fs').promises;
const path = require('path');

class TrainingDataGenerator {
  constructor() {
    this.positions = [];
    this.evaluations = [];
  }

  // Simple material-based evaluation function
  evaluatePosition(fen) {
    const chess = new Chess(fen);
    const board = chess.board();
    const pieceValues = {
      'p': 1, 'P': -1,    // pawns
      'n': 3, 'N': -3,    // knights
      'b': 3, 'B': -3,    // bishops
      'r': 5, 'R': -5,    // rooks
      'q': 9, 'Q': -9,    // queens
      'k': 0, 'K': 0      // kings (not counted in material)
    };

    let evaluation = 0;
    
    // Material count
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          evaluation += pieceValues[piece.type];
        }
      }
    }

    // Position evaluation (simple center control bonus)
    const centerSquares = [[3,3], [3,4], [4,3], [4,4]];
    for (const [i, j] of centerSquares) {
      const piece = board[i][j];
      if (piece) {
        evaluation += piece.color === 'w' ? 0.2 : -0.2;
      }
    }

    // Normalize evaluation to [-1, 1] range
    return Math.tanh(evaluation / 15);
  }

  // Generate positions from a complete game
  generateFromGame(pgn) {
    const chess = new Chess();
    chess.loadPgn(pgn);
    const moves = chess.history({ verbose: true });
    
    // Reset to starting position
    chess.reset();
    
    // Add starting position
    this.positions.push(chess.fen());
    this.evaluations.push(this.evaluatePosition(chess.fen()));

    // Play through the game, saving positions
    for (const move of moves) {
      chess.move(move);
      this.positions.push(chess.fen());
      this.evaluations.push(this.evaluatePosition(chess.fen()));
    }
  }

  // Generate positions from multiple games
  async generateFromPGNFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const games = content.split('\n\n[');
    
    for (let game of games) {
      if (!game.startsWith('[')) game = '[' + game;
      try {
        this.generateFromGame(game);
      } catch (error) {
        console.error('Error processing game:', error.message);
      }
    }
  }

  // Generate random positions for diversity
  generateRandomPositions(count) {
    const chess = new Chess();
    
    for (let i = 0; i < count; i++) {
      // Make some random moves
      const moves = Math.floor(Math.random() * 30) + 10; // 10-40 moves
      
      chess.reset();
      
      for (let j = 0; j < moves; j++) {
        const possibleMoves = chess.moves();
        if (possibleMoves.length === 0) break;
        
        const randomMove = possibleMoves[
          Math.floor(Math.random() * possibleMoves.length)
        ];
        
        chess.move(randomMove);
      }
      
      this.positions.push(chess.fen());
      this.evaluations.push(this.evaluatePosition(chess.fen()));
    }
  }

  // Save generated data
  async saveToFile(filePath) {
    const data = {
      positions: this.positions,
      evaluations: this.evaluations
    };
    
    await fs.writeFile(
      filePath,
      JSON.stringify(data),
      'utf-8'
    );
  }

  // Load previously generated data
  async loadFromFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    this.positions = data.positions;
    this.evaluations = data.evaluations;
  }

  // Clear current data
  clear() {
    this.positions = [];
    this.evaluations = [];
  }

  // Get current dataset size
  getSize() {
    return this.positions.length;
  }
}

module.exports = TrainingDataGenerator; 