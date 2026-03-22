import { RIGVEDA_CONTENT } from './rigvedaContent';
import { GITA_CONTENT } from './gitaContent';

export const INITIAL_BOOKS = [
  {
    title: 'Rigveda',
    author: 'Ancient Rishis',
    category: 'Philosophy',
    readingTime: '15 min',
    cover: '/rigveda-cover.jpg',
    summary: 'The Rigveda is the oldest known Vedic Sanskrit text.',
    teachings: ['Unity in Diversity', 'Cosmic Order (Rita)'],
    quotes: ['Truth is one, though the wise call it by many names.'],
    chapters: [],
    pages: RIGVEDA_CONTENT,
    tags: ['Sacred', 'Ancient']
  },
  {
    title: 'Bhagavad Gita',
    author: 'Vyasa',
    category: 'Philosophy',
    readingTime: '15 min',
    cover: '/puranas-cover.jpg',
    summary: 'The Bhagavad Gita is a 700-verse Hindu scripture.',
    teachings: ['Karma Yoga', 'Bhakti Yoga'],
    quotes: ['You have a right to your actions, but never to the fruits of your actions.'],
    chapters: [],
    pages: GITA_CONTENT,
    tags: ['Sacred', 'Philosophy']
  },
  {
    title: 'Mahabharata',
    author: 'Vyasa',
    category: 'Classics',
    readingTime: '30 min',
    cover: '/mahabharata-cover.jpg',
    summary: 'The Mahabharata is one of the two major Sanskrit epics of ancient India.',
    teachings: ['Dharma', 'Duty'],
    quotes: ['What is here is found elsewhere. What is not here is nowhere else.'],
    chapters: [],
    pages: [],
    tags: ['Epic', 'Classics']
  }
];
