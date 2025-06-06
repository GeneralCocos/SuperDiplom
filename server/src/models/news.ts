import { Schema, model, Document, Types } from 'mongoose';

interface INews extends Document {
  title: string;
  content: string;
  imageUrl: string;
  category: 'tournament' | 'education' | 'event' | 'other';
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['tournament', 'education', 'event', 'other'],
    default: 'other'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const News = model<INews>('News', newsSchema);
export default News; 