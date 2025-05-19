declare module 'react-chessboard' {
  import { FC } from 'react';

  interface ChessboardProps {
    position?: string;
    onPieceDrop?: (sourceSquare: string, targetSquare: string) => boolean;
    onSquareClick?: (square: string) => void;
    boardOrientation?: 'white' | 'black';
    customBoardStyle?: React.CSSProperties;
    arePiecesDraggable?: boolean;
    boardWidth?: number;
    showBoardNotation?: boolean;
  }

  export const Chessboard: FC<ChessboardProps>;
} 