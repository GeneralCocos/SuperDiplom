const { Chess } = require('chess.js');

class ChessAI {
  constructor() {
    this.evaluatePieces = {
      p: 10,  // pawn
      n: 30,  // knight
      b: 30,  // bishop
      r: 50,  // rook
      q: 90,  // queen
      k: 0    // king (not counted in material evaluation)
    };
  }

  async initialize() {
    // No initialization needed for basic minimax implementation
    return Promise.resolve();
  }

  async getBestMove(fen, depth = 3) {
    const chess = new Chess(fen);
    
    if (chess.isGameOver()) {
      return null;
    }

    const moves = chess.moves({ verbose: true });
    let bestMove = null;
    let bestValue = -Infinity;

    for (const move of moves) {
      try {
        chess.move(move);
        const value = -this.minimax(chess, depth - 1, -Infinity, Infinity, false);
        chess.undo();

        if (value > bestValue) {
          bestValue = value;
          bestMove = move;
        }
      } catch (error) {
        console.error('Invalid move:', move, error);
        continue;
      }
    }

    if (!bestMove) {
      return null;
    }

    // Verify the move is valid
    try {
      const testChess = new Chess(fen);
      const moveString = `${bestMove.from}${bestMove.to}${bestMove.promotion || ''}`;
      testChess.move(moveString);
      return moveString;
    } catch (error) {
      console.error('Final move validation failed:', bestMove, error);
      return null;
    }
  }

  minimax(chess, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || chess.isGameOver()) {
      return this.evaluatePosition(chess);
    }

    const moves = chess.moves({ verbose: true });

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        try {
          chess.move(move);
          const evaluation = this.minimax(chess, depth - 1, alpha, beta, false);
          chess.undo();
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) {
            break;
          }
        } catch (error) {
          console.error('Invalid move in maximizing:', move, error);
          continue;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        try {
          chess.move(move);
          const evaluation = this.minimax(chess, depth - 1, alpha, beta, true);
          chess.undo();
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          if (beta <= alpha) {
            break;
          }
        } catch (error) {
          console.error('Invalid move in minimizing:', move, error);
          continue;
        }
      }
      return minEval;
    }
  }

  evaluatePosition(chess) {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -1000 : 1000;
    }

    if (chess.isDraw()) {
      return 0;
    }

    let score = 0;
    const board = chess.board();

    // Material and position evaluation
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          // Material value
          const value = this.evaluatePieces[piece.type.toLowerCase()];
          score += piece.color === 'w' ? value : -value;

          // Position bonus
          const positionBonus = this.getPositionBonus(piece.type, i, j, piece.color);
          score += piece.color === 'w' ? positionBonus : -positionBonus;
        }
      }
    }

    // Mobility evaluation (number of legal moves)
    const currentTurn = chess.turn();
    const moves = chess.moves().length;
    const fen = chess.fen();
    const oppositeTurn = currentTurn === 'w' ? 'b' : 'w';
    chess.load(fen.replace(` ${currentTurn} `, ` ${oppositeTurn} `));
    const opponentMoves = chess.moves().length;
    chess.load(fen);
    
    score += (moves - opponentMoves) * 0.1;

    // Scale the score to make it more reasonable
    return score / 10;
  }

  getPositionBonus(pieceType, row, col, color) {
    const centerBonus = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 3, 3, 2, 1, 0],
      [0, 1, 2, 3, 3, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const pawnBonus = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [5, 5, 5, 5, 5, 5, 5, 5],
      [1, 1, 2, 3, 3, 2, 1, 1],
      [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
      [0, 0, 0, 2, 2, 0, 0, 0],
      [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
      [0.5, 1, 1, -2, -2, 1, 1, 0.5],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    let bonus = 0;
    const actualRow = color === 'w' ? row : 7 - row;
    const actualCol = color === 'w' ? col : 7 - col;

    switch (pieceType.toLowerCase()) {
      case 'p':
        bonus = pawnBonus[actualRow][actualCol];
        break;
      case 'n':
      case 'b':
        bonus = centerBonus[actualRow][actualCol] * 2;
        break;
      case 'r':
        bonus = actualRow === 7 ? 2 : 0; // Rook on 7th rank
        break;
      case 'q':
        bonus = centerBonus[actualRow][actualCol];
        break;
      case 'k':
        // King safety: prefer corners in early/mid game
        bonus = centerBonus[actualRow][actualCol] * -1;
        break;
    }

    return bonus;
  }

  async train(positions, evaluations) {
    // No training needed for minimax implementation
    return Promise.resolve();
  }
}

module.exports = ChessAI; 