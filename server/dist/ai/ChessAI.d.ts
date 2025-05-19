import { Chess } from 'chess.js';
declare class ChessAI {
    private evaluatePieces;
    initialize(): Promise<void>;
    getBestMove(fen: string, depth?: number): Promise<string | null>;
    private minimax;
    evaluatePosition(chess: Chess): number;
    train(positions: string[], evaluations: number[]): Promise<void>;
}
export default ChessAI;
