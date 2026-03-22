export type BlockType = 'intro' | 'quote' | 'teaching' | 'story' | 'lesson' | 'reflection' | 'fact';

export interface ContentBlock {
  type: BlockType;
  content: string | string[];
  title?: string;
  author?: string;
}

export interface VedaPage {
  title: string;
  blocks: ContentBlock[];
}

export interface Chapter {
  title: string;
  summary: string;
  image?: string;
}

export interface Page {
  page: number;
  title: string;
  text: string;
  quote: string;
  insight: string;
}

export interface Book {
  id: number | string;
  _id?: string;
  title: string;
  author: string;
  cover: string;
  pages: any[]; // Use any[] temporarily to avoid complex union issues in existing code
  category?: string;
  readingTime?: string;
  summary?: string;
  teachings?: string[];
  quotes?: string[];
  chapters?: Chapter[];
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'philosophy', name: 'Philosophy', icon: 'psychology', color: 'bg-primary/10' },
  { id: 'business', name: 'Business', icon: 'trending_up', color: 'bg-secondary/10' },
  { id: 'growth', name: 'Growth', icon: 'self_improvement', color: 'bg-tertiary/10' },
  { id: 'classics', name: 'Classics', icon: 'history_edu', color: 'bg-primary/10' },
];
