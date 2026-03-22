import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, ChevronRight, BookOpen } from 'lucide-react';
import booksData from '../data/books.json';
import { Book, CATEGORIES } from '../types';
import BookCover from '../components/BookCover';

interface SearchProps {
  onSelectBook: (book: Book) => void;
  onMenu: () => void;
}

const Search: React.FC<SearchProps> = ({ onSelectBook, onMenu }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const books: Book[] = booksData as any[];

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsSearching(true);
      try {
        const q = searchQuery.toLowerCase().trim();
        const filtered = books.filter(book => {
          const matchesSearch = q.length === 0 || 
            book.title.toLowerCase().includes(q) || 
            book.author.toLowerCase().includes(q);
          
          return matchesSearch;
        });
        setSearchResults(filtered);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, books]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
      className="pb-32 min-h-screen bg-background"
    >
      <main className="relative z-10 px-6 py-10 space-y-12 max-w-4xl mx-auto">
        {/* Search Bar */}
        <section className="space-y-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="font-label text-xs uppercase tracking-[0.4em] text-primary font-black mb-2">Discovery</span>
              <h2 className="font-headline text-4xl md:text-6xl text-on-surface font-black tracking-tighter uppercase">Search Wisdom</h2>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMenu}
              className="w-14 h-14 bg-surface border-4 border-outline rounded-2xl flex items-center justify-center shadow-lg hover:border-primary transition-all"
            >
              <SearchIcon className="w-7 h-7 text-primary" />
            </motion.button>
          </div>

          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-[30px] opacity-20 blur-xl group-focus-within:opacity-50 transition-all duration-500"></div>
            <div className="relative flex items-center bg-surface rounded-[25px] p-6 border-4 border-outline shadow-2xl group-focus-within:border-primary transition-all">
              <SearchIcon className="w-8 h-8 text-primary mr-4 group-focus-within:scale-110 transition-transform" />
              <input 
                className="bg-transparent border-none focus:ring-0 w-full font-headline text-2xl font-black text-on-surface placeholder-on-surface/30" 
                placeholder="Search ancient insights..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {isSearching && (
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-primary border-t-transparent"></div>
              )}
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
            <h2 className="font-headline text-2xl font-black text-on-surface px-4">
              {isSearching ? 'Searching...' : searchQuery.trim().length > 0 ? `Found ${searchResults.length} Sacred Texts` : 'Recommended for You'}
            </h2>
            <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {(searchQuery.trim().length > 0 ? searchResults : books.slice(0, 4)).map((book) => (
              <motion.div 
                key={book.id} 
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectBook(book)} 
                className="group bg-surface border-4 border-outline rounded-[35px] p-6 flex gap-6 items-center cursor-pointer shadow-lg hover:shadow-2xl hover:border-primary transition-all"
              >
                <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-xl shrink-0 border-2 border-outline/10">
                  <BookCover title={book.title} />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-headline text-xl font-black text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-2">{book.title}</h3>
                  <p className="font-body text-sm font-black text-on-surface/40 uppercase tracking-widest">{book.author}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </motion.div>
            ))}

            {searchQuery.trim().length > 0 && searchResults.length === 0 && !isSearching && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20 bg-surface/50 rounded-[40px] border-4 border-dashed border-outline/20"
              >
                <div className="w-24 h-24 bg-outline/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-12 h-12 text-outline" />
                </div>
                <p className="font-headline text-2xl font-black text-outline">No sacred texts found matching your search.</p>
              </motion.div>
            )}
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
};

export default Search;
