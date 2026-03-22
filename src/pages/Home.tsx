import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Search, Library as LibraryIcon, ChevronRight, Clock, Play } from 'lucide-react';
import booksData from '../data/books.json';
import BookCover from '../components/BookCover';
import { Book } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentReading, setCurrentReading] = useState<{ bookId: number; page: number } | null>(null);
  const [recentBooks, setRecentBooks] = useState<number[]>([]);
  const books: Book[] = booksData as any[];

  useEffect(() => {
    // Load current reading
    const savedReading = localStorage.getItem('currentReading');
    if (savedReading) {
      setCurrentReading(JSON.parse(savedReading));
    }

    // Load recent books
    const savedRecent = localStorage.getItem('recentBooks');
    if (savedRecent) {
      setRecentBooks(JSON.parse(savedRecent));
    }
  }, []);

  const continueReadingBook = currentReading ? books.find(b => b.id === currentReading.bookId) : null;
  const recentlyViewedBooks = recentBooks
    .map(id => books.find(b => b.id === id))
    .filter((b): b is Book => !!b);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background pb-32 grain-texture"
    >
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Welcome Header */}
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <span className="font-label text-xs uppercase tracking-[0.4em] text-primary font-black">Welcome Back</span>
          <h1 className="font-headline text-4xl md:text-6xl text-on-surface font-black tracking-tighter uppercase">Your Sanctuary</h1>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Continue Reading Section */}
          {continueReadingBook && (
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
                <h2 className="font-headline text-2xl font-black text-on-surface px-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Continue Reading
                </h2>
                <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
              </div>

              <div className="bg-surface border-4 border-outline rounded-[40px] p-8 flex flex-col md:flex-row gap-8 items-center shadow-xl indian-border relative overflow-hidden">
                <div className="absolute inset-0 mandala-bg opacity-[0.03] pointer-events-none"></div>
                <div className="w-32 h-44 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-outline/10 relative z-10">
                  <BookCover title={continueReadingBook.title} />
                </div>
                <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
                  <div>
                    <h3 className="font-headline text-3xl font-black text-on-surface leading-tight">{continueReadingBook.title}</h3>
                    <p className="font-body text-lg text-on-surface/50 font-black uppercase tracking-widest">Lesson {currentReading?.page}</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/book/${continueReadingBook.id}`)}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-headline font-black text-lg uppercase tracking-widest shadow-lg flex items-center gap-3 mx-auto md:mx-0"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Resume Journey
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}

          {/* Recently Viewed Section */}
          {recentlyViewedBooks.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
                <h2 className="font-headline text-2xl font-black text-on-surface px-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-secondary" />
                  Recently Viewed
                </h2>
                <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {recentlyViewedBooks.map((book) => (
                  <motion.div 
                    key={book.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="group cursor-pointer space-y-4"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-4 border-outline shadow-lg group-hover:border-primary transition-all">
                      <BookCover title={book.title} />
                    </div>
                    <h4 className="font-headline text-lg font-black text-on-surface line-clamp-1 group-hover:text-primary transition-colors text-center">{book.title}</h4>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Quick Actions Section */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
              <h2 className="font-headline text-2xl font-black text-on-surface px-4">Quick Actions</h2>
              <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/library')}
                className="bg-surface border-4 border-outline rounded-[32px] p-8 flex items-center gap-6 hover:border-primary transition-all shadow-lg group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <LibraryIcon className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="font-headline text-2xl font-black text-on-surface">The Library</p>
                  <p className="font-body text-sm text-on-surface/40 font-black uppercase tracking-widest">Explore all texts</p>
                </div>
                <ChevronRight className="w-6 h-6 ml-auto text-on-surface/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/search')}
                className="bg-surface border-4 border-outline rounded-[32px] p-8 flex items-center gap-6 hover:border-primary transition-all shadow-lg group"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                  <Search className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="font-headline text-2xl font-black text-on-surface">Search Wisdom</p>
                  <p className="font-body text-sm text-on-surface/40 font-black uppercase tracking-widest">Find specific insights</p>
                </div>
                <ChevronRight className="w-6 h-6 ml-auto text-on-surface/20 group-hover:text-secondary group-hover:translate-x-2 transition-all" />
              </motion.button>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Home;
