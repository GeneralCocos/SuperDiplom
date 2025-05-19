import { Chess, Move as ChessMove } from 'chess.js';

interface Move {
  from: string;
  to: string;
  promotion?: string;
}

interface ScoredMove {
  move: ChessMove;
  score: number;
}

type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export class ChessAI {
  private game: Chess;
  private difficulty: 'easy' | 'medium' | 'hard';

  constructor(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.game = new Chess();
    this.difficulty = difficulty;
  }

  public async initialize(): Promise<void> {
    // Инициализация ИИ (если нужна)
    return Promise.resolve();
  }

  public setPosition(fen: string): void {
    this.game = new Chess(fen);
  }

  public makeMove(): Move | null {
    const moves = this.game.moves({ verbose: true });
    if (moves.length === 0) return null;

    switch (this.difficulty) {
      case 'easy':
        return this.makeRandomMove(moves);
      case 'medium':
        return this.makeMediumMove(moves);
      case 'hard':
        return this.makeHardMove(moves);
      default:
        return this.makeRandomMove(moves);
    }
  }

  private makeRandomMove(moves: ChessMove[]): Move {
    const randomIndex = Math.floor(Math.random() * moves.length);
    const move = moves[randomIndex];
    return {
      from: move.from,
      to: move.to,
      promotion: move.promotion
    };
  }

  private makeMediumMove(moves: ChessMove[]): Move {
    // Приоритеты для ходов
    const priorities = {
      capture: 3,
      check: 2,
      center: 1,
      development: 1
    };

    const scoredMoves = moves.map(move => {
      let score = 0;
      
      // Захват фигуры
      if (move.captured) {
        score += priorities.capture;
      }

      // Шах
      if (move.san.includes('+')) {
        score += priorities.check;
      }

      // Ход в центр
      const centerSquares = ['d4', 'd5', 'e4', 'e5'];
      if (centerSquares.includes(move.to)) {
        score += priorities.center;
      }

      // Развитие фигур
      if (move.piece !== 'p' && move.piece !== 'k') {
        score += priorities.development;
      }

      return { move, score };
    });

    // Выбираем ход с наивысшим приоритетом
    scoredMoves.sort((a, b) => b.score - a.score);
    const bestMoves = scoredMoves.filter(move => move.score === scoredMoves[0].score);
    const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)].move;

    return {
      from: selectedMove.from,
      to: selectedMove.to,
      promotion: selectedMove.promotion
    };
  }

  private makeHardMove(moves: ChessMove[]): Move {
    // Простая оценка позиции
    const pieceValues: Record<PieceType, number> = {
      p: 1,  // пешка
      n: 3,  // конь
      b: 3,  // слон
      r: 5,  // ладья
      q: 9,  // ферзь
      k: 0   // король
    };

    const scoredMoves = moves.map(move => {
      let score = 0;
      
      // Базовая оценка хода
      if (move.captured) {
        const pieceType = move.captured.toLowerCase() as PieceType;
        if (pieceType in pieceValues) {
          score += pieceValues[pieceType] * 10;
        }
      }

      // Оценка безопасности короля
      if (move.piece === 'k') {
        const isCastling = move.san.includes('O-O');
        if (isCastling) {
          score += 5;
        }
      }

      // Оценка контроля центра
      const centerSquares = ['d4', 'd5', 'e4', 'e5'];
      if (centerSquares.includes(move.to)) {
        score += 2;
      }

      // Оценка развития фигур
      if (move.piece !== 'p' && move.piece !== 'k') {
        score += 1;
      }

      // Оценка шахов
      if (move.san.includes('+')) {
        score += 3;
      }

      return { move, score };
    });

    // Выбираем лучший ход
    scoredMoves.sort((a, b) => b.score - a.score);
    const bestMove = scoredMoves[0].move;

    return {
      from: bestMove.from,
      to: bestMove.to,
      promotion: bestMove.promotion
    };
  }

  public setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = difficulty;
  }

  public async train(positions: string[], evaluations: number[]): Promise<void> {
    // Здесь можно добавить логику обучения ИИ
    return Promise.resolve();
  }

  public async evaluatePosition(fen: string): Promise<number> {
    // Простая оценка позиции
    const game = new Chess(fen);
    const moves = game.moves({ verbose: true });
    
    if (moves.length === 0) {
      if (game.isCheckmate()) return -1000;
      if (game.isStalemate()) return 0;
      return -500;
    }

    let score = 0;
    const pieceValues: Record<PieceType, number> = {
      p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
    };

    // Оценка материала
    for (const piece of game.board().flat()) {
      if (piece) {
        const pieceType = piece.type.toLowerCase() as PieceType;
        const value = pieceValues[pieceType];
        score += piece.color === 'w' ? value : -value;
      }
    }

    // Оценка активности фигур
    const whiteMoves = game.moves({ verbose: true }).length;
    game.undo();
    const blackMoves = game.moves({ verbose: true }).length;
    score += (whiteMoves - blackMoves) * 0.1;

    return score;
  }
} 