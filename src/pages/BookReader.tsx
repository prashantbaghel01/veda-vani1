import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Quote, Lightbulb, Bookmark, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface BookmarkItem {
  bookId: number;
  page: number;
}

const BookReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [book, setBook] = useState<Book | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const foundBook = (booksData as Book[]).find(b => b.id === Number(id));
    if (foundBook) {
      setBook(foundBook);
      
      // Save recently viewed
      const recentBooks: number[] = JSON.parse(localStorage.getItem('recentBooks') || '[]');
      const updatedRecent = [foundBook.id, ...recentBooks.filter(id => id !== foundBook.id)].slice(0, 5);
      localStorage.setItem('recentBooks', JSON.stringify(updatedRecent));
    } else {
      navigate('/library');
    }
  }, [id, navigate]);

  // Check if current page is bookmarked and save current reading
  useEffect(() => {
    if (!book) return;
    const bookmarks: BookmarkItem[] = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const exists = bookmarks.some(b => b.bookId === book.id && b.page === currentPage);
    setIsBookmarked(exists);

    // Save current reading
    localStorage.setItem('currentReading', JSON.stringify({
      bookId: book.id,
      page: currentPage
    }));
  }, [book, currentPage]);

  if (!book) return null;

  const pageContent = book.pages.find(p => p.page === currentPage) || book.pages[0];

  const toggleBookmark = () => {
    const bookmarks: BookmarkItem[] = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const index = bookmarks.findIndex(b => b.bookId === book.id && b.page === currentPage);

    if (index > -1) {
      // Remove bookmark
      bookmarks.splice(index, 1);
      setIsBookmarked(false);
    } else {
      // Add bookmark
      bookmarks.push({ bookId: book.id, page: currentPage });
      setIsBookmarked(true);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  const handleNext = () => {
    if (currentPage < book.pages.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background pb-24 flex flex-col"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b-2 border-outline/20 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/library')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-outline/30 hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div className="flex flex-col">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-0.5">{book.author}</span>
            <h1 className="font-headline text-2xl text-on-surface font-black tracking-tighter truncate max-w-[200px] sm:max-w-none leading-none">{book.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Bookmark Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all shadow-sm font-headline font-black text-sm uppercase tracking-widest ${
              isBookmarked 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-white border-outline/30 text-on-surface/40 hover:border-primary hover:text-primary'
            }`}
          >
            {isBookmarked ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Bookmark</span>
              </>
            )}
          </motion.button>

          <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-outline/30 shadow-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-headline font-black text-sm text-on-surface uppercase tracking-widest">Page {currentPage} of {book.pages.length}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Page Title */}
            <div className="flex flex-col">
              <span className="font-label text-xs uppercase tracking-[0.4em] text-primary font-black mb-2">Lesson {currentPage}</span>
              <h2 className="font-headline text-4xl md:text-6xl text-on-surface font-black tracking-tighter uppercase leading-none">{pageContent.title}</h2>
            </div>

            {/* Main Text */}
            <div className="bg-white p-8 md:p-12 rounded-[40px] border-4 border-outline shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
              <p className="font-body text-xl md:text-2xl text-on-surface/80 font-black leading-relaxed">
                {pageContent.text}
              </p>
            </div>

            {/* Quote & Insight Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 p-8 rounded-[32px] border-2 border-primary/20 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-primary">
                  <Quote className="w-6 h-6" />
                  <span className="font-headline font-black text-sm uppercase tracking-widest">Wisdom</span>
                </div>
                <p className="font-headline text-2xl text-on-surface font-black italic tracking-tight leading-tight">
                  "{pageContent.quote}"
                </p>
              </div>

              <div className="bg-secondary/10 p-8 rounded-[32px] border-2 border-secondary/20 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-secondary">
                  <Lightbulb className="w-6 h-6" />
                  <span className="font-headline font-black text-sm uppercase tracking-widest">Insight</span>
                </div>
                <p className="font-body text-lg text-on-surface/70 font-black leading-snug">
                  {pageContent.insight}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto flex justify-between gap-4 pointer-events-auto">
          <motion.button 
            whileHover={currentPage !== 1 ? { scale: 1.02, y: -2 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.98 } : {}}
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`flex-1 h-16 rounded-[24px] font-headline font-black text-lg uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg border-b-4 ${
              currentPage === 1 
                ? 'bg-outline/20 text-on-surface/30 border-transparent cursor-not-allowed' 
                : 'bg-white text-on-surface border-outline/30 hover:border-primary hover:text-primary active:border-b-0 active:translate-y-1'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
            Previous
          </motion.button>
          
          <motion.button 
            whileHover={currentPage !== book.pages.length ? { scale: 1.02, y: -2 } : {}}
            whileTap={currentPage !== book.pages.length ? { scale: 0.98 } : {}}
            onClick={handleNext}
            disabled={currentPage === book.pages.length}
            className={`flex-1 h-16 rounded-[24px] font-headline font-black text-lg uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg border-b-4 ${
              currentPage === book.pages.length 
                ? 'bg-outline/20 text-on-surface/30 border-transparent cursor-not-allowed' 
                : 'bg-primary text-white border-black/20 hover:bg-primary/90 active:border-b-0 active:translate-y-1'
            }`}
          >
            {currentPage === book.pages.length ? 'Finished' : 'Next Lesson'}
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </footer>
    </motion.div>
  );
};

export default BookReader;
