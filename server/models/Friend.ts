import mongoose, { Schema, Document } from 'mongoose';

export interface IFriend extends Document {
  user: mongoose.Types.ObjectId;
  friend: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted';
}

const FriendSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  friend: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
}, {
  timestamps: true
});

// Compound index to ensure unique friendship pairs
FriendSchema.index({ user: 1, friend: 1 }, { unique: true });

export default mongoose.model<IFriend>('Friend', FriendSchema); 