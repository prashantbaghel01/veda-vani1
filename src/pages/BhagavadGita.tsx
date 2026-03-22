import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Bookmark, Star } from 'lucide-react';
import FlipBook from '../components/FlipBook';
import { GITA_CONTENT } from '../data/gitaContent';
import { Book } from '../types';

interface BhagavadGitaPageProps {
  onBack: () => void;
  book?: Book;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const BhagavadGitaPage: React.FC<BhagavadGitaPageProps> = ({ 
  onBack, 
  book, 
  isFavorite, 
  onToggleFavorite 
}) => {
  return (
    <div className="min-h-screen bg-background grain-texture overflow-hidden flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md px-4 md:px-6 py-4 flex items-center justify-between border-b border-outline/30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-outline/50 shadow-sm hover:bg-surface transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div>
            <h1 className="font-headline text-xl text-on-surface font-black tracking-tight uppercase">Bhagavad Gita</h1>
            <p className="text-[9px] font-label uppercase tracking-[0.3em] text-primary/60 font-black">The Song of God</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleFavorite}
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-outline/50 shadow-sm hover:bg-surface transition-all active:scale-95 ${isFavorite ? 'bg-secondary/10 border-secondary' : ''}`}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'text-secondary fill-current' : 'text-primary'}`} />
          </button>
          <button 
            onClick={() => {
              if (navigator.share && book) {
                navigator.share({
                  title: book.title,
                  text: book.summary,
                  url: window.location.href
                }).catch(console.error);
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-outline/50 shadow-sm hover:bg-surface transition-all active:scale-95"
          >
            <Share2 className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative py-12">
        {/* Background Motifs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] mandala-bg opacity-[0.02] animate-rotate-slow pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl z-10 px-4"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-3xl opacity-50"></div>
            <FlipBook pages={GITA_CONTENT} />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 text-center relative z-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-surface/50 border border-outline/30 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface/40 font-black">
              Click or drag corners to flip pages
            </p>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <div className="h-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"></div>
    </div>
  );
};

export default BhagavadGitaPage;
