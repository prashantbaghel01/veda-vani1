import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter {
  title: string;
  summary: string;
  image?: string;
}

export interface VedaPage {
  title: string;
  blocks: {
    type: string;
    content: string | string[];
    title?: string;
    author?: string;
  }[];
}

export interface IBook extends Document {
  title: string;
  author: string;
  category: string;
  readingTime: string;
  cover: string;
  summary: string;
  teachings: string[];
  quotes: string[];
  chapters: IChapter[];
  pages: VedaPage[];
  tags: string[];
}

const PageBlockSchema = new Schema({
  type: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  title: { type: String },
  author: { type: String },
});

const VedaPageSchema = new Schema({
  title: { type: String, required: true },
  blocks: [PageBlockSchema],
});

const ChapterSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String },
});

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  readingTime: { type: String, required: true },
  cover: { type: String, required: true },
  summary: { type: String, required: true },
  teachings: [{ type: String }],
  quotes: [{ type: String }],
  chapters: [ChapterSchema],
  pages: [VedaPageSchema],
  tags: [{ type: String }],
}, { timestamps: true });

// Indexing for search scalability
BookSchema.index({ title: 'text', author: 'text', tags: 'text' });

export default mongoose.model<IBook>('Book', BookSchema);
