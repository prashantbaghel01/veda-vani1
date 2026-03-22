import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Library as LibraryIcon, Search, ArrowRight, Star } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden grain-texture">
      {/* Background Motifs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 mandala-bg opacity-[0.03] animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] mandala-bg opacity-[0.02] animate-float-slow" style={{ animationDelay: '-5s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rangoli-motif opacity-[0.02] animate-rotate-slow"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Star className="w-4 h-4 text-primary fill-current" />
            <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black">Ancient Wisdom Redefined</span>
            <Star className="w-4 h-4 text-primary fill-current" />
          </div>
          
          <h1 className="font-headline text-6xl md:text-9xl text-on-surface leading-[0.9] font-black tracking-tighter uppercase">
            Veda <br />
            <span className="text-primary italic">Vani</span>
          </h1>
          
          <p className="text-on-surface/60 max-w-lg mx-auto font-medium text-lg md:text-2xl leading-relaxed">
            Experience the profound depth of Indian philosophy through a curated, modern reading experience.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/library')}
            className="w-full sm:w-auto bg-primary text-white px-12 py-6 rounded-[32px] font-headline font-black text-xl uppercase tracking-widest shadow-[0_20px_50px_rgba(228,87,46,0.3)] flex items-center justify-center gap-4 group"
          >
            <LibraryIcon className="w-6 h-6" />
            The Library
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/search')}
            className="w-full sm:w-auto bg-surface border-4 border-outline text-on-surface px-12 py-6 rounded-[32px] font-headline font-black text-xl uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-xl flex items-center justify-center gap-4"
          >
            <Search className="w-6 h-6" />
            Search Wisdom
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-12"
        >
          <div className="flex items-center justify-center gap-4 opacity-20">
            <div className="h-[1px] w-12 bg-primary"></div>
            <div className="w-8 h-8 lotus-motif"></div>
            <div className="h-[1px] w-12 bg-primary"></div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;

