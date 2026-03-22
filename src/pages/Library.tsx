import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import booksData from '../data/books.json';
import BookCover from '../components/BookCover';

interface Page {
  page: number;
  title: string;
  text: string;
  quote: string;
  insight: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  pages: Page[];
}

const Library: React.FC = () => {
  const navigate = useNavigate();
  const books: Book[] = booksData as Book[];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background pb-24"
    >
      <div className="p-6 md:p-10">
        <div className="flex flex-col mb-10">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-primary font-black mb-2">Knowledge Hub</span>
          <h2 className="font-headline text-4xl md:text-6xl text-on-surface font-black tracking-tighter uppercase">The Library</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
          {books.map((book) => (
            <motion.div 
              key={book.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/book/${book.id}`)}
              className="group cursor-pointer flex flex-col gap-4"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] border-4 border-outline shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:border-primary">
                <BookCover title={book.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-white font-headline font-black text-sm uppercase tracking-widest">Read Now</span>
                </div>
              </div>
              <div className="flex flex-col px-2">
                <h3 className="font-headline text-lg md:text-xl text-on-surface font-black leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
                <p className="font-body text-sm text-on-surface/60 font-black uppercase tracking-wider">{book.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Library;
