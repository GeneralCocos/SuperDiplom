import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  userId: mongoose.Types.ObjectId;
}

const AchievementSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlockedAt: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model<IAchievement>('Achievement', AchievementSchema); 