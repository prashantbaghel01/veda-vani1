import mongoose, { Schema, Document } from 'mongoose';

export interface IReadingProgress extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  page: number;
  lastRead: Date;
}

const ReadingProgressSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  page: { type: Number, default: 0, min: 0 },
  lastRead: { type: Date, default: Date.now },
}, { timestamps: true });

// One progress record per user per book
ReadingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model<IReadingProgress>('ReadingProgress', ReadingProgressSchema);
