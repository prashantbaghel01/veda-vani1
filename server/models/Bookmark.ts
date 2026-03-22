import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  page: number;
  content: string;
}

const BookmarkSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  page: { type: Number, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

// Ensure a user can bookmark multiple pages in the same book
BookmarkSchema.index({ user: 1, book: 1, page: 1 }, { unique: true });

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
