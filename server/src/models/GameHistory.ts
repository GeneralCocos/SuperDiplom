import mongoose, { Schema, Document } from 'mongoose';

export interface IGameHistory extends Document {
  whitePlayer: mongoose.Types.ObjectId;
  blackPlayer: mongoose.Types.ObjectId;
  moves: Array<{
    from: string;
    to: string;
    piece: string;
    timestamp: Date;
  }>;
  result: 'white' | 'black' | 'draw';
  gameType: 'local' | 'online' | 'ai';
  startTime: Date;
  endTime: Date;
  timeControl: number; // in seconds
  createdAt: Date;
}

const gameHistorySchema = new Schema({
  whitePlayer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blackPlayer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moves: [{
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    piece: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  result: {
    type: String,
    enum: ['white', 'black', 'draw'],
    required: true
  },
  gameType: {
    type: String,
    enum: ['local', 'online', 'ai'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  timeControl: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
gameHistorySchema.index({ whitePlayer: 1, createdAt: -1 });
gameHistorySchema.index({ blackPlayer: 1, createdAt: -1 });
gameHistorySchema.index({ gameType: 1, createdAt: -1 });

export const GameHistory = mongoose.model<IGameHistory>('GameHistory', gameHistorySchema); 