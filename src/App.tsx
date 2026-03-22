import React, { useState, useEffect, Component } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import BhagavadGitaPage from './pages/BhagavadGita';
import { 
  Menu, 
  Bell, 
  Timer, 
  Headphones, 
  Bookmark, 
  Flame, 
  Search, 
  Library as LibraryIcon, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  Quote, 
  Star, 
  Settings, 
  LogOut, 
  ChevronRight,
  BookOpen,
  TrendingUp,
  Brain,
  History,
  CheckCircle2,
  Map,
  Zap,
  Shield
} from 'lucide-react';
import Library from './pages/Library';
import BookReader from './pages/BookReader';
import SearchPage from './pages/Search';
import BookCover from './components/BookCover';
import { Book, CATEGORIES, Category, VedaPage, ContentBlock } from './types';
import { INITIAL_BOOKS } from './data/books';
import { useAuth } from './context/AuthContext.tsx';
import LoginScreen from './pages/LoginScreen.tsx';
import SignupScreen from './pages/SignupScreen.tsx';
import { 
  AccountPage, 
  SubscriptionPage, 
  NotificationsPage, 
  PrivacyPage 
} from './pages/SettingsPages';
import { 
  STORAGE_KEYS, 
  getStorageItem, 
  setStorageItem, 
  UserProgress, 
  UserBookmarks, 
  UserFavorites 
} from './utils/storage';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
};

// --- Error Boundary ---

class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if ((this as any).state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-10 text-center grain-texture">
          <div className="bg-surface border-4 border-outline p-12 rounded-[40px] max-w-md shadow-2xl space-y-6">
            <h2 className="text-4xl font-headline font-black text-on-surface uppercase tracking-tighter">Something went wrong</h2>
            <p className="font-body text-lg font-black text-on-surface/50">We encountered an unexpected error. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white h-16 rounded-[20px] font-headline font-black text-xl shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all"
            >
              Refresh App
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

// --- Components ---

const FloatingMandala = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Mandalas */}
    <div className="absolute top-1/4 -left-20 w-96 h-96 mandala-bg opacity-[0.03] animate-float-slow"></div>
    <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] mandala-bg opacity-[0.02] animate-float-slow" style={{ animationDelay: '-5s', animationDirection: 'reverse' }}></div>
    
    {/* Lotus Corner Motifs */}
    <div className="absolute -top-20 -right-20 w-64 h-64 lotus-motif opacity-[0.04] animate-pulse-soft"></div>
    <div className="absolute -bottom-20 -left-20 w-64 h-64 lotus-motif opacity-[0.04] animate-pulse-soft" style={{ animationDelay: '-3s' }}></div>

    {/* Rangoli Center-ish Motifs */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rangoli-motif opacity-[0.02] animate-rotate-slow"></div>
  </div>
);

const TopAppBar = ({ 
  title, 
  onBack, 
  onMenu, 
  onAction, 
  actionIcon: ActionIcon 
}: { 
  title: string, 
  onBack?: () => void, 
  onMenu?: () => void,
  onAction?: () => void, 
  actionIcon?: any 
}) => (
  <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b-2 border-outline/20 px-4 md:px-8 py-4 flex items-center justify-between shadow-[0_4px_20px_-5px_rgba(46,21,0,0.1)]">
    <div className="flex items-center gap-4 md:gap-6">
      {onBack ? (
        <button 
          onClick={onBack} 
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-outline/30 hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      ) : (
        <button 
          onClick={onMenu}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-outline/30 hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
      <div className="flex flex-col">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-0.5">Veda Vani</span>
        <h1 className="font-headline text-xl md:text-3xl text-on-surface font-black tracking-tighter truncate max-w-[180px] sm:max-w-none leading-none">{title}</h1>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {ActionIcon && (
        <button 
          onClick={onAction} 
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-outline/30 hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
        >
          <ActionIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
    </div>
  </header>
);

const Sidebar = ({ isOpen, onClose, onNavigate, logout }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onNavigate: (tab: string) => void,
  logout: () => void
}) => {
  const { user, isGuest } = useAuth();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[320px] bg-surface z-[70] shadow-2xl border-r-4 border-primary/20 flex flex-col p-8 grain-texture"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <BookOpen className="w-7 h-7" />
                </div>
                <span className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface">Veda Vani</span>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center text-on-surface/40">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            {/* User Profile Section */}
            <div className="mb-10 p-5 rounded-3xl bg-white border-2 border-outline/20 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-black text-lg text-on-surface leading-tight">
                    {isGuest ? 'Guest Seeker' : (user?.name || 'Seeker')}
                  </span>
                  <span className="font-label text-xs text-on-surface/50 font-bold uppercase tracking-widest">
                    {isGuest ? 'Temporary Path' : 'Spiritual Journey'}
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-grow space-y-2">
              {[
                { id: 'home', label: 'Home Sanctuary', icon: BookOpen },
                { id: 'search', label: 'Bazaar of Wisdom', icon: Search },
                { id: 'library', label: 'Sacred Collection', icon: LibraryIcon },
                { id: 'bookmarks', label: 'Saved Wisdom', icon: Bookmark },
                { id: 'profile', label: 'Spiritual Path', icon: User },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-primary/5 group transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border-2 border-outline/30 flex items-center justify-center text-on-surface/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-headline text-lg font-black text-on-surface/60 group-hover:text-primary transition-colors">{item.label}</span>
                </button>
              ))}
              
              <button
                onClick={() => {
                  onNavigate('profile');
                  onClose();
                }}
                className="w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-primary/5 group transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-white border-2 border-outline/30 flex items-center justify-center text-on-surface/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="font-headline text-lg font-black text-on-surface/60 group-hover:text-primary transition-colors">Settings</span>
              </button>
            </nav>

            <button 
              onClick={logout}
              className="mt-auto flex items-center gap-6 p-5 rounded-3xl bg-error/5 text-error hover:bg-error hover:text-white transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-transparent group-hover:text-white transition-all">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-headline text-lg font-black">Leave Sanctuary</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BottomNavBar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-xl border-2 border-outline/30 px-8 py-4 rounded-[32px] flex items-center gap-10 shadow-[0_20px_50px_-15px_rgba(46,21,0,0.2)] z-50">
      {[
        { id: 'home', label: 'Home', icon: BookOpen, path: '/' },
        { id: 'search', label: 'Search', icon: Search, path: '/search' },
        { id: 'library', label: 'Library', icon: LibraryIcon, path: '/library' },
        { id: 'bookmarks', label: 'Saved', icon: Bookmark, path: '/bookmarks' },
        { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
      ].map((tab) => {
        const isActive = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path);
        
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              navigate(tab.path);
            }}
            className={`flex flex-col items-center gap-1.5 transition-all relative group ${isActive ? 'text-primary' : 'text-on-surface/40 hover:text-on-surface/80'}`}
          >
            <tab.icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
            {isActive && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute -inset-4 bg-primary/10 blur-xl rounded-full -z-10"
              />
            )}
            <span className={`font-label text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>{tab.label}</span>
            {isActive && (
              <motion.div 
                layoutId="nav-dot"
                className="w-1.5 h-1.5 bg-primary rounded-full absolute -bottom-1"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

// --- Screens ---

const SectionDivider = () => (
  <div className="flex items-center justify-center py-8 opacity-20">
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary"></div>
    <div className="mx-4 w-12 h-12 lotus-motif animate-pulse-soft"></div>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary"></div>
  </div>
);

const HomeScreen = ({ 
  books, 
  onSelectBook,
  progress,
  onMenu,
  setActiveTab
}: { 
  books: Book[], 
  onSelectBook: (book: Book) => void,
  progress: UserProgress,
  onMenu: () => void,
  setActiveTab: (tab: string) => void
}) => {
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(useTransform(mouseX, [0, window.innerWidth], [-15, 15]), springConfig);
  const y = useSpring(useTransform(mouseY, [0, window.innerHeight], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div className="pb-48 min-h-screen grain-texture" onMouseMove={handleMouseMove}>
      <FloatingMandala />
      <TopAppBar 
        title="Veda Vani" 
        onMenu={onMenu} 
        actionIcon={Bell} 
        onAction={() => navigate('/notifications')}
      />
      <main className="relative z-10 max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="px-6 pt-12 pb-16">
          <motion.div 
            style={{ x, y }}
            className="relative rounded-[40px] overflow-hidden bg-surface p-1 shadow-[0_30px_100px_rgba(0,0,0,0.1)] group indian-border"
          >
            <div className="absolute inset-0 mandala-bg opacity-[0.03] pointer-events-none"></div>
            <div className="bg-surface/40 backdrop-blur-sm p-12 md:p-20 rounded-[32px] flex flex-col items-center text-center space-y-10 relative z-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 lotus-motif opacity-[0.06] -mr-20 -mt-20 animate-pulse-soft"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 rangoli-motif opacity-[0.06] -ml-20 -mb-20 animate-rotate-slow"></div>
              
              <div className="space-y-6 relative z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full"
                >
                  <Star className="w-4 h-4 text-primary fill-current" />
                  <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black">Ancient Wisdom Redefined</span>
                  <Star className="w-4 h-4 text-primary fill-current" />
                </motion.div>
                <h2 className="font-headline text-5xl sm:text-6xl md:text-8xl text-on-surface leading-[1.05] font-black tracking-tighter">
                  Sacred Texts, <br />
                  <span className="text-primary italic">Modern Mind</span>
                </h2>
              </div>
              <p className="text-on-surface/60 max-w-lg font-medium text-lg md:text-xl leading-relaxed">
                Experience the profound depth of Indian philosophy through a curated, modern reading experience.
              </p>
              <button 
                onClick={() => navigate('/library')}
                className="pill-button bg-primary text-white flex items-center gap-4 text-xl px-12 py-6"
              >
                Explore the Veda
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Daily Dose */}
        <section className="px-6 py-12 space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-16 bg-primary/30 rounded-full"></div>
            <h3 className="font-headline text-3xl md:text-4xl font-black tracking-tight">Daily Enlightenment</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-surface border border-outline/50 p-10 rounded-[32px] flex flex-col justify-between h-56 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
            >
              <div className="z-10 space-y-4">
                <div className="w-14 h-14 bg-tertiary/10 rounded-2xl flex items-center justify-center">
                  <Timer className="w-7 h-7 text-tertiary" />
                </div>
                <p className="font-headline text-2xl text-on-surface font-black">Quick Insights</p>
                <p className="text-on-surface/50 font-medium">10-minute deep dives into sacred verses.</p>
              </div>
              <BookOpen className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] text-on-surface group-hover:scale-110 transition-transform" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-surface border border-outline/50 p-10 rounded-[32px] flex flex-col justify-between h-56 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
            >
              <div className="z-10 space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <Headphones className="w-7 h-7 text-secondary" />
                </div>
                <p className="font-headline text-2xl text-on-surface font-black">Audio Satsang</p>
                <p className="text-on-surface/50 font-medium">Listen to the rhythmic chants of the Vedas.</p>
              </div>
              <Zap className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] text-on-surface group-hover:scale-110 transition-transform" />
            </motion.div>
          </div>
        </section>

        <SectionDivider />

        {/* Trending Now */}
        <section className="py-20 space-y-12">
          <div className="px-8 flex justify-between items-end">
            <div className="space-y-2">
              <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black">Popular Wisdom</span>
              <h3 className="font-headline text-4xl font-black tracking-tight">Trending Now</h3>
            </div>
            <button 
              onClick={() => navigate('/library')}
              className="font-label text-sm text-primary font-black uppercase tracking-widest hover:underline underline-offset-8"
            >
              See All
            </button>
          </div>
          <div className="flex overflow-x-auto pb-16 hide-scrollbar snap-x px-8 gap-10">
            {books.map((book) => {
              const bookProgress = progress[book._id] !== undefined 
                ? Math.round(((progress[book._id] + 1) / (book.pages?.length || 1)) * 100) 
                : 0;

              return (
                <motion.div 
                  key={book._id} 
                  onClick={() => onSelectBook(book)} 
                  whileHover={{ y: -10 }}
                  className="snap-center flex-shrink-0 w-80 cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl mb-8 border-[6px] border-white group-hover:shadow-primary/30 transition-all duration-500">
                    <BookCover title={book.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                      <div className="space-y-4 w-full">
                        <span className="bg-secondary text-on-surface font-label text-[10px] uppercase font-black px-4 py-1.5 rounded-full shadow-lg">
                          {book.category}
                        </span>
                        {bookProgress > 0 && (
                          <div className="space-y-2">
                            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-secondary h-full rounded-full shadow-[0_0_10px_rgba(255,183,3,0.6)]"
                                style={{ width: `${bookProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{bookProgress}% Completed</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <h4 className="font-headline text-2xl text-on-surface font-black group-hover:text-primary transition-colors leading-tight mb-3">{book.title}</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Timer className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-label text-xs text-on-surface/50 uppercase tracking-widest font-black">{book.readingTime}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <SectionDivider />

        {/* Explore Genres */}
        <section className="px-6 py-24 bg-on-surface/[0.02] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 mandala-bg opacity-[0.03] -mr-48 -mt-48 animate-rotate-slow"></div>
          <div className="text-center mb-16 space-y-4">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary font-black">Bazaar of Wisdom</span>
            <h3 className="font-headline text-4xl md:text-5xl font-black tracking-tight relative z-10">Explore Categories</h3>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {CATEGORIES.map((cat) => (
              <motion.div 
                key={cat.id} 
                whileHover={{ y: -8 }}
                className="book-card flex flex-col items-center justify-center text-center p-10 gap-6 group cursor-pointer"
              >
                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-primary/30">
                  {cat.id === 'philosophy' && <Brain className="w-10 h-10" />}
                  {cat.id === 'business' && <TrendingUp className="w-10 h-10" />}
                  {cat.id === 'growth' && <Zap className="w-10 h-10" />}
                  {cat.id === 'classics' && <History className="w-10 h-10" />}
                </div>
                <p className="font-headline text-2xl font-black tracking-tight">{cat.name}</p>
              </motion.div>
            ))}
          </div>
        </section>

      {/* Quote of the Day */}
      <section className="px-6 py-32">
        <div className="bg-surface p-16 md:p-24 rounded-[64px] text-center relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.08)] indian-border">
          <div className="absolute inset-0 mandala-bg opacity-[0.03]"></div>
          <Quote className="w-16 h-16 text-primary mx-auto mb-10 opacity-20" />
          <p className="font-serif text-4xl md:text-5xl text-on-surface font-black italic leading-[1.2] relative z-10 max-w-3xl mx-auto">
            "The mind is everything. What you think, you become."
          </p>
          <div className="mt-12 flex flex-col items-center relative z-10">
            <div className="h-[2px] w-24 bg-primary/20 rounded-full mb-6"></div>
            <p className="font-label text-sm text-primary font-black uppercase tracking-[0.4em]">Gautam Buddha</p>
          </div>
        </div>
      </section>
    </main>
  </div>
  );
};

const DetailScreen = ({ 
  book, 
  onBack, 
  onStartReading, 
  isFavorite, 
  onToggleFavorite,
  lastPage 
}: { 
  book: Book, 
  onBack: () => void, 
  onStartReading: () => void,
  isFavorite: boolean,
  onToggleFavorite: () => void,
  lastPage: number
}) => (
  <div className="pb-48 grain-texture min-h-screen">
    <FloatingMandala />
    <TopAppBar title="Veda Vani" onBack={onBack} actionIcon={Share2} onAction={() => {
      if (navigator.share) {
        navigator.share({
          title: book.title,
          text: book.summary,
          url: window.location.href
        }).catch(console.error);
      } else {
        console.log('Web Share not supported');
      }
    }} />
    <main className="relative max-w-5xl mx-auto">
      <div className="absolute inset-0 mandala-bg opacity-[0.03] -z-10"></div>
      
      <section className="px-6 pt-16 pb-24 flex flex-col items-center text-center">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative mb-16 group"
        >
          <div className="absolute -inset-8 border-2 border-primary/10 rounded-[40px] transform rotate-3"></div>
          <div className="absolute -inset-8 border-2 border-secondary/10 rounded-[40px] transform -rotate-2"></div>
          <div className="w-72 h-[420px] relative z-10 transform -rotate-1 group-hover:rotate-0 transition-transform duration-700">
            <BookCover title={book.title} />
          </div>
          <button 
            onClick={onToggleFavorite}
            className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full z-20 shadow-2xl border-4 border-background flex items-center justify-center transition-all ${isFavorite ? 'bg-secondary text-on-surface' : 'bg-surface text-on-surface/30'}`}
          >
            <Star className={`w-8 h-8 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </motion.div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-secondary/10 border border-secondary/20 rounded-full">
            <Timer className="w-4 h-4 text-secondary" />
            <span className="font-label text-xs font-black uppercase tracking-widest text-on-surface">{book.readingTime}</span>
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-label text-xs font-black uppercase tracking-widest text-on-surface">{book.category}</span>
          </div>
        </div>
        
        <h2 className="font-headline text-5xl md:text-8xl text-on-surface leading-[1.1] mb-6 font-black tracking-tighter max-w-4xl">{book.title}</h2>
        <p className="font-serif text-2xl md:text-3xl text-on-surface/50 italic mb-12">{book.author}</p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
          <button 
            onClick={onStartReading}
            className="flex-1 bg-primary text-white h-20 md:h-24 rounded-[32px] font-headline font-black text-xl md:text-2xl shadow-[0_20px_50px_rgba(228,87,46,0.3)] hover:shadow-[0_30px_70px_rgba(228,87,46,0.4)] active:scale-95 transition-all flex items-center justify-center gap-4 group"
          >
            {lastPage > 0 ? 'Resume Journey' : 'Begin Journey'}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
          </button>
          
          {lastPage > 0 && (
            <button 
              onClick={() => {
                // Logic to reset progress if needed, but for now just start from beginning
                onStartReading();
              }}
              className="px-8 bg-surface border-4 border-outline text-on-surface h-20 md:h-24 rounded-[32px] font-headline font-black text-lg hover:bg-surface-container-high transition-all"
            >
              Restart
            </button>
          )}
        </div>
        {lastPage > 0 && (
          <p className="mt-6 font-label text-xs font-black text-primary uppercase tracking-[0.2em]">
            Last read at Verse {lastPage + 1}
          </p>
        )}
      </section>

      <section className="bg-surface/30 backdrop-blur-sm px-6 py-24 relative border-y border-outline/20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-8 mb-12">
            <div className="w-16 h-16 bg-secondary rounded-[20px] flex items-center justify-center shadow-xl">
              <Quote className="w-8 h-8 text-on-surface" />
            </div>
            <h3 className="font-headline text-4xl font-black tracking-tight">The Essence</h3>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-secondary to-transparent rounded-full"></div>
          </div>
          <div className="space-y-10 text-on-surface/70 leading-[1.8] text-xl md:text-2xl font-medium">
            <p>{book.summary}</p>
          </div>
        </div>
      </section>

      {book.teachings && book.teachings.length > 0 && (
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black mb-4 block">Ancient Wisdom for Modern Life</span>
              <h3 className="font-headline text-4xl md:text-5xl font-black text-on-surface">Key Philosophical Pillars</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {book.teachings.map((teaching, idx) => (
                <div key={idx} className="book-card group">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                    <Brain className="w-7 h-7" />
                  </div>
                  <h4 className="font-headline text-2xl font-black mb-4">Teaching {idx + 1}</h4>
                  <p className="text-on-surface/70 leading-relaxed font-medium">{teaching}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {book.quotes && book.quotes.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-surface rounded-[40px] p-12 md:p-20 shadow-2xl relative indian-border overflow-hidden">
              <div className="absolute inset-0 mandala-bg opacity-5"></div>
              <div className="flex justify-center mb-12 relative z-10">
                <div className="flex items-center gap-3 px-8 py-3 bg-background border-2 border-outline rounded-full font-label text-xs font-black tracking-[0.2em] uppercase shadow-sm">
                  <Star className="w-4 h-4 text-primary" />
                  Enlightened Quotes
                  <Star className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="space-y-16 relative z-10">
                {book.quotes.map((quote, idx) => (
                  <React.Fragment key={idx}>
                    <blockquote className="text-center italic font-headline text-3xl md:text-4xl text-on-surface font-black leading-tight px-4">
                      "{quote}"
                    </blockquote>
                    {idx < book.quotes.length - 1 && (
                      <div className="flex justify-center gap-3">
                        <div className="w-12 h-1 bg-primary/20 rounded-full mt-3"></div>
                        <Zap className="w-6 h-6 text-primary fill-current" />
                        <div className="w-12 h-1 bg-primary/20 rounded-full mt-3"></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <button 
        onClick={() => {
          // Placeholder for audio functionality
          console.log('Audio feature coming soon');
        }}
        className="fixed bottom-28 right-8 pill-button bg-primary text-white flex items-center gap-3 z-50 shadow-2xl"
      >
        <Headphones className="w-6 h-6 fill-current" />
        <span className="font-label font-black uppercase tracking-widest text-sm">Listen Now</span>
      </button>
    </main>
  </div>
);

const ReadingScreen = ({ 
  book, 
  onBack, 
  initialPage = 0,
  onProgressUpdate,
  onBookmarkToggle,
  bookmarkedPages = []
}: { 
  book: Book, 
  onBack: () => void,
  initialPage?: number,
  onProgressUpdate: (pageIndex: number) => void,
  onBookmarkToggle: (pageIndex: number, content: string) => void,
  bookmarkedPages: number[]
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pages = book.pages || [];

  const handleBookmark = () => {
    const page = pages[currentPage];
    if (!page) return;
    
    let content = 'Verse Bookmark';
    if (page.blocks) {
      const quoteBlock = page.blocks.find((b: any) => b.type === 'quote');
      const rawContent = quoteBlock ? quoteBlock.content : page.blocks[0]?.content || 'Verse Bookmark';
      content = Array.isArray(rawContent) ? rawContent.join(' ') : rawContent;
    } else if (page.quote) {
      content = page.quote;
    } else if (page.text) {
      content = page.text.substring(0, 100) + '...';
    }
    
    onBookmarkToggle(currentPage, content);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    onProgressUpdate(currentPage);
  }, [currentPage]);

  if (pages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-10 text-center">
        <h2 className="font-headline text-3xl font-black mb-6">Content coming soon!</h2>
        <button onClick={onBack} className="pill-button bg-primary text-white">Go Back</button>
      </div>
    );
  }

  const page = pages[currentPage];
  const progress = ((currentPage + 1) / pages.length) * 100;
  const isBookmarked = bookmarkedPages.includes(currentPage);

  return (
    <div className="min-h-screen bg-background grain-texture pb-48">
      <div className="fixed top-0 left-0 w-full h-1.5 z-[60] bg-outline/10">
        <motion.div 
          className="h-full bg-secondary shadow-[0_0_15px_rgba(255,183,3,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
      <FloatingMandala />
      <header className="h-24 flex items-center justify-between px-8 bg-surface/60 backdrop-blur-xl sticky top-0 z-50 border-b border-outline/20">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-background border border-outline/50 rounded-2xl shadow-sm hover:bg-surface transition-all">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-headline font-black text-xl uppercase tracking-tight text-on-surface truncate max-w-[200px]">{book.title}</span>
          <span className="font-label text-[10px] font-black text-primary uppercase tracking-[0.3em]">Verse {currentPage + 1} of {pages.length}</span>
        </div>
        <button 
          onClick={handleBookmark}
          className={`w-12 h-12 flex items-center justify-center bg-background border border-outline/50 rounded-2xl shadow-sm transition-all ${isBookmarked ? 'bg-primary/10 border-primary' : 'hover:bg-surface'}`}
        >
          <Bookmark className={`w-6 h-6 ${isBookmarked ? 'text-primary fill-current' : 'text-primary'}`} />
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-20 space-y-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-16"
          >
            <h2 className="font-headline text-5xl md:text-6xl font-black text-primary leading-tight text-center tracking-tight">{page.title}</h2>
            
            <div className="space-y-12">
              {page.blocks ? page.blocks.map((block: any, idx: number) => (
                <div key={idx} className="relative">
                  {block.type === 'intro' && (
                    <div className="wisdom-box">
                      <div className="absolute top-0 right-0 w-32 h-32 lotus-motif opacity-[0.02] -mr-10 -mt-10"></div>
                      <p className="font-body text-xl md:text-2xl font-medium leading-[1.8] text-on-surface/80">
                        {block.content}
                      </p>
                    </div>
                  )}

                  {block.type === 'quote' && (
                    <div className="bg-primary/5 p-12 md:p-16 rounded-[32px] shadow-sm relative indian-border overflow-hidden text-center">
                      <div className="absolute inset-0 mandala-bg opacity-[0.03]"></div>
                      <Quote className="w-10 h-10 text-primary/20 mx-auto mb-8" />
                      <p className="font-serif text-2xl md:text-3xl font-black italic text-on-surface leading-[1.4] relative z-10">
                        "{block.content}"
                      </p>
                      {block.author && (
                        <p className="mt-10 font-label text-xs font-black uppercase tracking-[0.3em] text-primary/60 relative z-10">
                          — {block.author}
                        </p>
                      )}
                    </div>
                  )}

                  {block.type === 'teaching' && (
                    <div className="bg-surface border border-outline/40 p-10 rounded-[32px] shadow-sm group hover:shadow-md transition-all duration-500">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <Brain className="w-7 h-7" />
                        </div>
                        <h4 className="font-headline text-2xl font-black tracking-tight">Key Teaching</h4>
                      </div>
                      <p className="font-body text-lg md:text-xl font-medium text-on-surface/70 leading-[1.8]">
                        {block.content}
                      </p>
                    </div>
                  )}

                  {block.type === 'story' && (
                    <div className="bg-on-surface text-background p-12 rounded-[32px] shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                          <Star className="w-7 h-7 fill-current" />
                        </div>
                        <h4 className="font-headline text-2xl font-black text-primary tracking-tight">Sacred Story</h4>
                      </div>
                      <p className="font-body text-lg md:text-xl font-medium text-background/80 leading-[1.8] italic">
                        {block.content}
                      </p>
                    </div>
                  )}

                  {block.type === 'lesson' && (
                    <div className="bg-primary/[0.03] border border-primary/20 p-10 rounded-[32px] flex flex-col md:flex-row gap-8 items-start">
                      <div className="w-14 h-14 bg-primary text-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md">
                        <Zap className="w-7 h-7 fill-current" />
                      </div>
                      <div>
                        <h4 className="font-headline text-xl font-black text-primary mb-4 uppercase tracking-widest">Modern Lesson</h4>
                        <p className="font-body text-lg md:text-xl font-medium text-on-surface/70 leading-[1.8]">
                          {block.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {block.type === 'fact' && (
                    <div className="bg-surface border border-outline/30 p-8 rounded-[24px] flex items-center gap-8 shadow-sm">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex-shrink-0 flex items-center justify-center">
                        <Map className="w-6 h-6" />
                      </div>
                      <p className="font-label text-xs font-black text-on-surface/50 uppercase tracking-[0.2em] leading-relaxed">
                        <span className="text-primary mr-3">DIVINE FACT:</span> {block.content}
                      </p>
                    </div>
                  )}

                  {block.type === 'reflection' && (
                    <div className="bg-background border-2 border-dashed border-outline/50 p-12 rounded-[32px] text-center space-y-8">
                      <h4 className="font-label text-[10px] font-black text-primary uppercase tracking-[0.4em]">Reflection</h4>
                      <p className="font-headline text-2xl md:text-3xl font-black text-on-surface leading-tight tracking-tight">
                        {block.content}
                      </p>
                      <div className="h-[1px] w-16 bg-primary/20 mx-auto rounded-full"></div>
                    </div>
                  )}
                </div>
              )) : (
                <div className="space-y-12">
                  {page.text && (
                    <div className="wisdom-box">
                      <p className="font-body text-xl md:text-2xl font-medium leading-[1.8] text-on-surface/80">
                        {page.text}
                      </p>
                    </div>
                  )}
                  {page.quote && (
                    <div className="bg-primary/5 p-12 md:p-16 rounded-[32px] shadow-sm relative indian-border overflow-hidden text-center">
                      <div className="absolute inset-0 mandala-bg opacity-[0.03]"></div>
                      <Quote className="w-10 h-10 text-primary/20 mx-auto mb-8" />
                      <p className="font-serif text-2xl md:text-3xl font-black italic text-on-surface leading-[1.4] relative z-10">
                        "{page.quote}"
                      </p>
                    </div>
                  )}
                  {page.insight && (
                    <div className="bg-surface border border-outline/40 p-10 rounded-[32px] shadow-sm group hover:shadow-md transition-all duration-500">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <Brain className="w-7 h-7" />
                        </div>
                        <h4 className="font-headline text-2xl font-black tracking-tight">Daily Insight</h4>
                      </div>
                      <p className="font-body text-lg md:text-xl font-medium text-on-surface/70 leading-[1.8]">
                        {page.insight}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 inset-x-0 p-8 bg-gradient-to-t from-background via-background to-transparent z-40">
        <div className="max-w-3xl mx-auto flex gap-6">
          <button 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="h-20 w-24 bg-surface border border-outline/50 rounded-[28px] flex items-center justify-center text-primary disabled:opacity-30 disabled:grayscale transition-all shadow-xl hover:-translate-y-1"
          >
            <ArrowLeft className="w-10 h-10" />
          </button>
          
          <div className="flex-grow h-20 bg-surface border border-outline/50 rounded-[28px] flex items-center px-10 gap-6 shadow-xl">
            <div className="flex-grow h-2.5 bg-outline/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                className="h-full bg-primary shadow-[0_0_15px_rgba(228,87,46,0.4)]"
              />
            </div>
            <span className="font-label text-xs font-black text-on-surface/40 uppercase tracking-widest whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>

          <button 
            onClick={() => {
              if (currentPage < pages.length - 1) {
                setCurrentPage(prev => prev + 1);
              } else {
                onBack();
              }
            }}
            className="h-20 px-12 bg-primary text-white rounded-[28px] font-headline font-black text-2xl flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(228,87,46,0.3)] hover:shadow-[0_20px_50px_rgba(228,87,46,0.4)] hover:-translate-y-1 active:scale-95 transition-all"
          >
            {currentPage === pages.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </footer>
    </div>
  );
};

const LibraryScreen = ({ 
  books, 
  onSelectBook,
  favorites,
  progress,
  onMenu,
  setActiveTab
}: { 
  books: Book[], 
  onSelectBook: (book: Book) => void,
  favorites: UserFavorites,
  progress: UserProgress,
  onMenu: () => void,
  setActiveTab: (tab: string) => void
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const favoriteBooks = books.filter(book => favorites[book._id]);
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-48 grain-texture min-h-screen">
      <FloatingMandala />
      <TopAppBar 
        title="Bazaar of Wisdom" 
        onMenu={onMenu} 
        actionIcon={LibraryIcon} 
        onAction={() => setActiveTab('home')}
      />
      <main className="relative z-10 px-8 py-10 space-y-16 max-w-6xl mx-auto">
        {/* Search and Filter */}
        <section className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-all"></div>
            <div className="relative flex items-center bg-surface border border-outline/50 rounded-2xl p-4 shadow-sm group-focus-within:border-primary transition-all">
              <Search className="w-6 h-6 text-primary/40 mr-4" />
              <input 
                type="text" 
                placeholder="Search your collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full font-headline text-xl font-black text-on-surface placeholder-on-surface/20"
              />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-full font-label text-xs font-black uppercase tracking-widest transition-all ${!selectedCategory ? 'bg-primary text-white shadow-lg' : 'bg-surface border border-outline/50 text-on-surface/40'}`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-2.5 rounded-full font-label text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat.name ? 'bg-primary text-white shadow-lg' : 'bg-surface border border-outline/50 text-on-surface/40'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Favorites Section */}
        {favoriteBooks.length > 0 && !searchQuery && !selectedCategory && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-black">Sacred Favorites</span>
                <h2 className="font-headline text-4xl font-black text-on-surface tracking-tight">Handpicked Wisdom</h2>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar snap-x">
              {favoriteBooks.map(book => (
                <motion.div 
                  key={book._id}
                  onClick={() => onSelectBook(book)}
                  whileHover={{ y: -8 }}
                  className="snap-start shrink-0 w-64 group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-[28px] overflow-hidden shadow-xl mb-4 border-2 border-outline/20 group-hover:border-secondary transition-all">
                    <BookCover title={book.title} />
                    <div className="absolute top-4 right-4 w-10 h-10 bg-secondary text-on-surface rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                  <h3 className="font-headline text-lg font-black text-on-surface line-clamp-1 group-hover:text-secondary transition-colors">{book.title}</h3>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Main Collection */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black">Your Sacred Collection</span>
              <h2 className="font-headline text-5xl font-black text-on-surface tracking-tight">
                {searchQuery || selectedCategory ? 'Filtered Results' : 'Saved Wisdom'}
              </h2>
            </div>
            <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 shadow-sm">
              <span className="font-label text-sm font-black text-primary uppercase tracking-widest">{filteredBooks.length} Manuscripts</span>
            </div>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
              {filteredBooks.map((book) => {
                const bookProgress = progress[book._id] !== undefined 
                  ? Math.round(((progress[book._id] + 1) / (book.pages?.length || 1)) * 100) 
                  : 0;

                return (
                  <motion.div 
                    key={book._id} 
                    onClick={() => onSelectBook(book)} 
                    whileHover={{ y: -12 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-[28px] overflow-hidden shadow-xl mb-6 border-[4px] border-white transition-all duration-500 group-hover:shadow-primary/30 group-hover:border-primary/20">
                      <BookCover title={book.title} />
                      {favorites[book._id] && (
                        <div className="absolute top-4 right-4 bg-secondary text-on-surface p-2.5 rounded-2xl shadow-xl z-10 border border-outline/50">
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                      )}
                      {bookProgress > 0 && (
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-secondary h-full rounded-full shadow-[0_0_15px_rgba(255,183,3,0.6)]"
                              style={{ width: `${bookProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-3">{bookProgress}% Completed</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-label text-[10px] px-3 py-1.5 bg-secondary text-on-surface rounded-full font-black uppercase tracking-widest shadow-sm">{book.category}</span>
                        <div className="flex items-center gap-1.5 text-on-surface/30">
                          <Timer className="w-3.5 h-3.5" />
                          <span className="font-label text-[10px] font-black uppercase tracking-widest">{book.readingTime}</span>
                        </div>
                      </div>
                      <h3 className="font-headline text-xl font-black leading-tight group-hover:text-primary transition-colors tracking-tight">{book.title}</h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 bg-surface/50 rounded-[40px] border-4 border-dashed border-outline/20">
              <div className="w-24 h-24 bg-outline/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-outline" />
              </div>
              <p className="font-headline text-2xl font-black text-outline">No manuscripts found for your search.</p>
            </div>
          )}
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-primary/30 rounded-full"></div>
            <h2 className="font-headline text-3xl font-black text-on-surface tracking-tight">Reading History</h2>
          </div>
          <div className="wisdom-box group cursor-pointer hover:border-primary/30 transition-all duration-500 flex items-center justify-between p-10">
            <div className="flex items-center gap-10">
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <History className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <p className="font-headline text-3xl font-black tracking-tight">Bhagavad Gita</p>
                <p className="font-body text-base font-medium text-on-surface/40">Last read recently • <span className="text-primary font-bold">Resumable from Flipbook</span></p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border border-outline/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
              <ChevronRight className="w-8 h-8" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const BookmarksScreen = ({ 
  bookmarks, 
  favorites,
  books,
  onSelectBook,
  onMenu 
}: { 
  bookmarks: any[], 
  favorites: UserFavorites,
  books: Book[],
  onSelectBook: (book: Book) => void,
  onMenu: () => void 
}) => {
  const savedBooks = books.filter(book => favorites[book._id]);

  return (
    <div className="pb-48 min-h-screen grain-texture">
      <FloatingMandala />
      <TopAppBar 
        title="Saved Wisdom" 
        onMenu={onMenu} 
        actionIcon={Bookmark}
      />
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Saved Books Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-primary/30 rounded-full"></div>
            <h3 className="font-headline text-3xl font-black text-on-surface">Saved Manuscripts</h3>
          </div>
          
          {savedBooks.length === 0 ? (
            <div className="bg-surface/50 border-2 border-dashed border-outline/30 p-12 rounded-[32px] text-center space-y-4">
              <LibraryIcon className="w-12 h-12 text-on-surface/20 mx-auto" />
              <p className="font-body text-lg text-on-surface/40 font-medium">No manuscripts saved to your collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {savedBooks.map(book => (
                <motion.div 
                  key={book._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => onSelectBook(book)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg mb-4 border-2 border-outline/20 group-hover:border-primary transition-all">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-headline text-lg font-black text-on-surface line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h4>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Verse Bookmarks Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-primary/30 rounded-full"></div>
            <h3 className="font-headline text-3xl font-black text-on-surface">Verse Bookmarks</h3>
          </div>

          {bookmarks.length === 0 ? (
            <div className="bg-surface/50 border-2 border-dashed border-outline/30 p-12 rounded-[32px] text-center space-y-4">
              <Bookmark className="w-12 h-12 text-on-surface/20 mx-auto" />
              <p className="font-body text-lg text-on-surface/40 font-medium">No verses bookmarked yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {bookmarks.filter(b => b.book).map((bookmark) => (
                <motion.div 
                  key={bookmark._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-outline/30 p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all group indian-border"
                >
                  <div className="flex items-start gap-6">
                    <div 
                      className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-md cursor-pointer"
                      onClick={() => onSelectBook(bookmark.book)}
                    >
                      <BookCover title={bookmark.book.title} />
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-headline text-2xl font-black text-on-surface group-hover:text-primary transition-colors">{bookmark.book.title}</h4>
                          <p className="font-label text-[10px] text-primary font-black uppercase tracking-widest">Verse {bookmark.page + 1}</p>
                        </div>
                        <span className="text-on-surface/20 text-xs font-medium">{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                      </div>
                      <blockquote className="font-serif text-xl text-on-surface/70 italic border-l-4 border-primary/20 pl-6 py-2">
                        "{bookmark.content}"
                      </blockquote>
                      <button 
                        onClick={() => onSelectBook(bookmark.book)}
                        className="text-primary font-label text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
                      >
                        Read Full Verse <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const ProfileScreen = ({ onMenu }: { onMenu: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="pb-48 grain-texture min-h-screen">
      <FloatingMandala />
      <TopAppBar 
        title="Spiritual Path" 
        onMenu={onMenu} 
        actionIcon={Settings} 
        onAction={() => navigate('/account')}
      />
      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="relative px-8 pt-20 pb-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -mr-48 -mt-48 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full -ml-48 -mb-48 blur-[120px]"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-10"
            >
              <div className="w-48 h-48 rounded-full p-2 bg-gradient-to-tr from-primary via-secondary to-tertiary shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
                <img alt="User Avatar" className="w-full h-full rounded-full object-cover border-[10px] border-background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf7svWDktzE4u8s2rdJpbxyykDYv4R4EFP4FvqNQwzmrxH-J8NEha0qQJ8mngsIJfGOogJRgRmnBont1J0NMDcdNpnh6vnBE08x37PGeGB5xd4kp4k_w0k5Y_yKNWiLRL48s0h0J39rg9lArDsn2OUAWU2fUzU-Pp6VxX7UCjSy6APNdIcxDzGSU4VdfM4MfnRPMq3tE_RsL2jgqxb-ML0VcRF8FK9vPwrfeELwojeQOIq8rjftq235rTixfDcBf80cPxCsZ0l4Lw" />
              </div>
              <div className="absolute -bottom-2 right-4 bg-tertiary text-white p-4 rounded-2xl border-4 border-background flex items-center justify-center shadow-2xl">
                <CheckCircle2 className="w-6 h-6 fill-current" />
              </div>
            </motion.div>
            <h2 className="font-headline text-6xl font-black text-on-surface mb-4 tracking-tighter">{user?.name || 'Arjun Sharma'}</h2>
          <div className="bg-primary/5 px-8 py-2.5 rounded-full border border-primary/20 shadow-sm">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary font-black">Enlightened Seeker • Level 12</span>
          </div>
        </div>
      </header>

      <section className="px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="sm:col-span-2 bg-primary p-12 rounded-[48px] shadow-[0_30px_70px_rgba(228,87,46,0.25)] flex items-center justify-between relative overflow-hidden group">
            <div className="absolute inset-0 mandala-bg opacity-[0.08] group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <Flame className="w-8 h-8 text-secondary fill-current" />
                <h3 className="font-headline text-4xl font-black text-white tracking-tight">12 Day Streak</h3>
              </div>
              <p className="text-white/70 font-medium text-lg">You're on a roll! Read for 3 more days to reach 'Sage' status.</p>
              <div className="flex gap-3">
                {[1,2,3,4,5,6,7].map(d => (
                  <div key={d} className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${d <= 5 ? 'bg-secondary text-on-surface' : 'bg-white/10 text-white/40'}`}>
                    {d}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/10 text-center">
              <p className="font-headline text-5xl font-black text-white mb-1">450</p>
              <p className="font-label text-[10px] text-white/60 uppercase tracking-widest font-black">Wisdom Points</p>
            </div>
          </div>

          <div className="wisdom-box flex items-center gap-8 p-10">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shadow-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <p className="font-headline text-3xl font-black tracking-tight">24</p>
              <p className="font-label text-xs text-on-surface/40 uppercase tracking-widest font-black">Books Read</p>
            </div>
          </div>

          <div className="wisdom-box flex items-center gap-8 p-10">
            <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary shadow-sm">
              <Timer className="w-8 h-8" />
            </div>
            <div>
              <p className="font-headline text-3xl font-black tracking-tight">128</p>
              <p className="font-label text-xs text-on-surface/40 uppercase tracking-widest font-black">Hours Spent</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="px-8 mb-8 flex justify-between items-end">
          <div className="space-y-1">
            <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black">Progress Path</span>
            <h3 className="font-headline text-3xl font-black text-on-surface">Reading Journey</h3>
          </div>
          <div className="w-12 h-12 bg-surface border-2 border-outline rounded-2xl flex items-center justify-center shadow-sm">
            <Map className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="relative py-10 overflow-x-auto no-scrollbar">
          <div className="flex gap-16 px-8 min-w-max items-center">
            {[
              { icon: History, label: 'Philosophy', completed: true },
              { icon: BookOpen, label: 'Classics', completed: true },
              { icon: Zap, label: 'Mythology', active: true },
              { icon: Star, label: 'Spirituality' }
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center relative shadow-xl transition-all ${
                    step.active ? 'bg-secondary border-4 border-white ring-8 ring-secondary/20 animate-pulse' : 
                    step.completed ? 'bg-primary border-4 border-white' : 'bg-surface border-4 border-outline'
                  }`}>
                    <step.icon className={`w-10 h-10 ${step.active || step.completed ? 'text-white' : 'text-outline'}`} />
                    {step.completed && (
                      <div className="absolute -top-2 -right-2 bg-secondary text-on-surface rounded-full p-1.5 border-4 border-background shadow-lg">
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </div>
                  <p className={`font-headline text-lg font-black ${step.active ? 'text-secondary' : step.completed ? 'text-primary' : 'text-outline'}`}>{step.label}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div className={`w-20 h-1.5 rounded-full ${step.completed && arr[idx+1].completed ? 'bg-primary' : 'bg-outline/20'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 mb-16">
        <div className="bg-surface border-2 border-outline rounded-[40px] overflow-hidden shadow-xl">
          {[
            { icon: User, label: 'Account Settings', color: 'text-primary', bg: 'bg-primary/10', path: '/account' },
            { icon: Star, label: 'Subscription', color: 'text-secondary', bg: 'bg-secondary/10', badge: 'PRO', path: '/subscription' },
            { icon: Bell, label: 'Notifications', color: 'text-tertiary', bg: 'bg-tertiary/10', path: '/notifications' },
            { icon: Shield, label: 'Privacy & Security', color: 'text-primary', bg: 'bg-primary/10', path: '/privacy' }
          ].map((item, idx, arr) => (
            <div 
              key={idx} 
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between p-8 hover:bg-surface-container-high transition-all cursor-pointer group active:scale-[0.98] ${idx < arr.length - 1 ? 'border-b-2 border-outline/10' : ''}`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="font-headline text-xl font-black text-on-surface">{item.label}</span>
              </div>
              <div className="flex items-center gap-4">
                {item.badge && (
                  <span className="bg-secondary text-on-surface px-3 py-1 rounded-full font-label text-[10px] font-black tracking-widest">{item.badge}</span>
                )}
                <ChevronRight className="w-6 h-6 text-outline group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={logout}
          className="w-full mt-10 py-6 rounded-[30px] border-4 border-error/10 text-error font-headline text-2xl font-black flex items-center justify-center gap-4 hover:bg-error hover:text-white hover:border-error transition-all shadow-lg group"
        >
          <LogOut className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          Logout From Journey
        </button>
      </section>
    </div>
  </div>
);
};

const DiscoverScreen = ({ books, onSelectBook, onMenu }: { books: Book[], onSelectBook: (book: Book) => void, onMenu: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsSearching(true);
      try {
        const q = searchQuery.toLowerCase();
        const filtered = books.filter(book => {
          const matchesSearch = searchQuery.trim().length === 0 || 
            book.title.toLowerCase().includes(q) || 
            book.author.toLowerCase().includes(q) ||
            book.tags.some(tag => tag.toLowerCase().includes(q));
          const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
          return matchesSearch && matchesCategory;
        });
        setSearchResults(filtered);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'books/search');
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, books]);

  return (
    <div className="pb-32 grain-texture min-h-screen">
      <FloatingMandala />
      <TopAppBar 
        title="Bazaar of Wisdom" 
        onMenu={onMenu} 
        actionIcon={Search} 
        onAction={() => {
          const input = document.querySelector('input[placeholder="Search ancient insights..."]') as HTMLInputElement;
          if (input) input.focus();
        }}
      />
      <main className="relative z-10 px-8 py-10 space-y-12 max-w-4xl mx-auto">
        {/* Search Bar */}
        <section className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-[30px] opacity-20 blur-xl group-focus-within:opacity-50 transition-all duration-500"></div>
            <div className="relative flex items-center bg-surface rounded-[25px] p-6 border-4 border-outline shadow-2xl group-focus-within:border-primary transition-all">
              <Search className="w-8 h-8 text-primary mr-4 group-focus-within:scale-110 transition-transform" />
              <input 
                className="bg-transparent border-none focus:ring-0 w-full font-headline text-2xl font-black text-on-surface placeholder-on-surface/30" 
                placeholder="Search ancient insights..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching && (
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-primary border-t-transparent"></div>
              )}
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-full font-label text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCategory ? 'bg-primary text-white shadow-lg' : 'bg-surface border-2 border-outline text-on-surface/40 hover:border-primary/30'}`}
            >
              All Paths
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-2.5 rounded-full font-label text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat.name ? 'bg-primary text-white shadow-lg' : 'bg-surface border-2 border-outline text-on-surface/40 hover:border-primary/30'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Search Results or Default Sections */}
        {(searchQuery.trim().length > 0 || selectedCategory) ? (
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
              <h2 className="font-headline text-2xl font-black text-on-surface px-4">
                {isSearching ? 'Searching...' : `Found ${searchResults.length} Sacred Texts`}
              </h2>
              <div className="h-1 flex-1 bg-outline/20 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {searchResults.length > 0 ? (
                searchResults.map((book) => (
                  <motion.div 
                    key={book._id} 
                    whileHover={{ y: -10, rotateY: 5, rotateX: -2 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => onSelectBook(book)} 
                    className="group bg-surface border-4 border-outline rounded-[35px] p-6 flex gap-6 items-center cursor-pointer shadow-lg hover:shadow-2xl hover:border-primary transition-all"
                  >
                    <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-xl shrink-0 border-2 border-outline/10">
                      <BookCover title={book.title} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-secondary/10 text-secondary px-3 py-0.5 rounded-full font-label text-[10px] font-black tracking-widest uppercase">{book.category}</span>
                      </div>
                      <h3 className="font-headline text-xl font-black text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-2">{book.title}</h3>
                      <p className="font-body text-sm font-black text-on-surface/40 uppercase tracking-widest">{book.author}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </motion.div>
                ))
              ) : !isSearching && (
                <div className="col-span-full text-center py-20 bg-surface/50 rounded-[40px] border-4 border-dashed border-outline/20">
                  <div className="w-24 h-24 bg-outline/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-outline" />
                  </div>
                  <p className="font-headline text-2xl font-black text-outline">No sacred texts found matching your search.</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Continue Reading */}
            {books.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black">Your Progress</span>
                    <h2 className="font-headline text-4xl font-black text-on-surface">Continue Reading</h2>
                  </div>
                  <div className="w-14 h-14 bg-surface border-4 border-outline rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-primary p-10 rounded-[45px] overflow-hidden shadow-2xl group cursor-pointer"
                  onClick={() => onSelectBook(books[0])}
                >
                  <div className="absolute inset-0 mandala-bg opacity-10 group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                    <div className="shrink-0 w-40 h-56 bg-white rounded-[25px] shadow-2xl rotate-[-3deg] overflow-hidden border-8 border-white group-hover:rotate-0 transition-transform duration-500">
                      <img alt="" className="w-full h-full object-cover" src={books[0].cover} />
                    </div>
                    <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <span className="bg-white/20 text-white px-4 py-1 rounded-full font-label text-xs font-black tracking-widest uppercase backdrop-blur-md">In Progress • 65%</span>
                        </div>
                        <h3 className="font-headline text-4xl font-black text-white leading-tight">{books[0].title}</h3>
                        <p className="font-body text-lg font-black text-white/70 uppercase tracking-widest">{books[0].author}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden border border-white/30">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-secondary h-full rounded-full shadow-[0_0_15px_rgba(255,183,3,0.5)]"
                          ></motion.div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onSelectBook(books[0])}
                        className="bg-white text-primary px-10 py-4 rounded-full font-headline text-lg font-black uppercase tracking-widest shadow-xl hover:bg-secondary hover:text-on-surface transition-all"
                      >
                        Resume Session
                      </button>
                    </div>
                  </div>
                </motion.div>
              </section>
            )}

            {/* Bazaar of Wisdom */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-black">Categories</span>
                  <h2 className="font-headline text-4xl font-black text-on-surface">Bazaar of Wisdom</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <motion.div 
                  whileHover={{ y: -10, rotateY: 5, rotateX: -2 }} 
                  transition={{ duration: 0.3 }}
                  className="bg-secondary p-8 rounded-[40px] aspect-square flex flex-col justify-between shadow-xl border-4 border-outline relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 mandala-bg opacity-10 group-hover:rotate-90 transition-transform duration-1000"></div>
                  <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 relative z-10">
                    <Zap className="w-10 h-10 text-white fill-current" />
                  </div>
                  <span className="font-headline text-2xl font-black text-on-surface leading-tight relative z-10">Self Improvement</span>
                </motion.div>
                
                <div className="grid grid-rows-2 gap-6">
                  <motion.div 
                    whileHover={{ x: 10, rotateY: 5, rotateX: -2 }} 
                    transition={{ duration: 0.3 }}
                    className="bg-tertiary rounded-[30px] p-6 flex items-center gap-4 border-4 border-outline shadow-lg cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-tertiary transition-all">
                      <TrendingUp className="w-7 h-7" />
                    </div>
                    <span className="font-headline text-xl font-black text-white">Business</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ x: 10, rotateY: 5, rotateX: -2 }} 
                    transition={{ duration: 0.3 }}
                    className="bg-primary rounded-[30px] p-6 flex items-center gap-4 border-4 border-outline shadow-lg cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all">
                      <Brain className="w-7 h-7" />
                    </div>
                    <span className="font-headline text-xl font-black text-white">Psychology</span>
                  </motion.div>
                </div>

                <motion.div 
                  whileHover={{ scale: 1.05, rotateY: 5, rotateX: -2 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-2 bg-surface border-4 border-outline rounded-[40px] p-8 flex justify-between items-center shadow-xl relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 mandala-bg opacity-5 group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="space-y-2 relative z-10">
                    <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary font-black">Featured Collection</span>
                    <h3 className="font-headline text-3xl font-black text-on-surface">Indian Philosophy</h3>
                    <p className="font-body text-sm font-black text-on-surface/40 uppercase tracking-widest">Ancient truths for modern living</p>
                  </div>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary relative z-10 group-hover:bg-primary group-hover:text-white transition-all">
                    <BookOpen className="w-10 h-10" />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Handpicked for You */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-label text-xs uppercase tracking-[0.3em] text-tertiary font-black">Curated</span>
                  <h2 className="font-headline text-4xl font-black text-on-surface">Handpicked for You</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {books.map((book) => (
                  <motion.div 
                    key={book._id} 
                    whileHover={{ x: 10, rotateY: 5, rotateX: -2 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => onSelectBook(book)} 
                    className="group flex gap-6 p-6 bg-surface border-4 border-outline rounded-[35px] hover:border-primary hover:shadow-2xl transition-all items-center cursor-pointer shadow-lg"
                  >
                    <div className="w-24 h-32 bg-outline/5 rounded-2xl flex-shrink-0 overflow-hidden shadow-xl border-2 border-outline/10">
                      <BookCover title={book.title} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-label text-[10px] px-3 py-1 bg-tertiary/10 text-tertiary rounded-full font-black uppercase tracking-widest">{book.category}</span>
                        <span className="font-label text-[10px] font-black text-on-surface/40 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Timer className="w-4 h-4" /> {book.readingTime}
                        </span>
                      </div>
                      <h3 className="font-headline text-xl font-black text-on-surface group-hover:text-primary transition-colors line-clamp-1">{book.title}</h3>
                      <p className="font-body text-sm font-black text-on-surface/40 uppercase tracking-widest">{book.author}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                      <Bookmark className="w-6 h-6" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Learn faster with 10 minute book summaries",
      description: "Discover the essence of global bestsellers through an Indian lens. Wisdom served fresh, like morning chai.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDISpEjflkZxU9lECTA9oMfmI4mCBAW-hDxFDIruSWCBqDf_diiyKW8c3eT7tOB0KXNeaHCWGRRZ5tAQp2mwrGHJyYuk5ooK4w1iUPmlqPqxPi881q05lp88_Fj47rWgH1n0sf0JHGa8Ddb9qbAQc8frgZaSfidSSZs5xFG3d4a0O75hG07fquUcN97JhPUIrPrqM7T-4NYfo2l_C48wOEA3tGa-55MiiXF_YhzIktzsipYeW32i5fqr_3Q3jpARx4GsQvolWUziDw",
      color: "text-secondary"
    },
    {
      title: "Discover wisdom from global and Indian books",
      description: "Unpack the secrets of Vedic philosophy, modern business, and timeless epics in crisp 5-minute summaries.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbqE6xgma87kIvgIhApVfRCG4hPy8Ez76p5_KEtbJOR2SuWVZfPkP6wjNJrxzBt-P9JmfgWI11zDLkJGbMJnrtppcFcHJzgRBwpWyrQGK9fB7U8tENVcL8YQ0JNzS0NsCiEfSSLC9sp_jYSRo-Y5LY5-261rSRCPRG_CJWDoxOt6DkC1VoofOsoJbUPdVmJnGB3ecumGtKBDNDxgMokdcc4woQ0XFIyESbpJ03dk-a50jicIRRKQ89fgs1Lq19BiSpfDDjOZqdRHc",
      color: "text-primary"
    },
    {
      title: "Build a daily learning habit",
      description: "Transform your commute or morning tea into a moment of ancient insight. Just 10 minutes a day to master timeless wisdom.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAr5X2RM2KHo9g1OQ45kMhGfcnCunIx-5BlzKEXbMr9vwmIOdyqj1ol_bw3dS0sFNegN1anWGntDEw1zck_BelvdHE8mAeT8qBLvwloKPG52o7Z_VxQM_U-fhoXQh72W_LmKCNtlGH9ds4sMp5YXjBQ6ONSZijZ7NHCTjeeAMULLTjrnOrFdHAL72uOcdKvkn9IdYfFbSlTFU14XQpF59ypn7A2417a9R40bMbdNLTCXJ2fvyXGRzd4FW14BtIk8NC0T8dtH66oAEI",
      color: "text-on-surface"
    }
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background grain-texture">
      <FloatingMandala />
      <header className="h-20 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b-4 border-outline">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="font-headline font-black text-2xl uppercase tracking-tighter">Veda Vani</span>
        </div>
        <button onClick={onComplete} className="font-label font-black text-xs tracking-[0.3em] text-secondary uppercase px-6 py-2 hover:bg-secondary/10 rounded-full transition-all border-2 border-transparent hover:border-secondary">
          Skip
        </button>
      </header>
      <main className="flex-grow flex flex-col px-10 pb-16 justify-center gap-12 relative z-10 max-w-2xl mx-auto">
        <div className="absolute inset-0 mandala-bg opacity-5 pointer-events-none"></div>
        
        <motion.div 
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative w-full aspect-square mx-auto"
        >
          <div className="absolute inset-0 border-8 border-secondary rotate-6 rounded-[40px] opacity-20"></div>
          <div className="absolute inset-0 border-4 border-primary -rotate-3 rounded-[40px]"></div>
          <div className="absolute inset-6 bg-surface rounded-[35px] overflow-hidden shadow-2xl border-4 border-outline flex items-center justify-center">
            <img src={steps[step].image} alt="" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <div className="space-y-6 text-center">
          <h1 className="font-headline text-5xl font-black leading-[1.1] text-on-surface tracking-tight">
            {steps[step].title.split(' ').map((word, i) => (
              <span key={i} className={word === '10' || word === 'minute' || word === 'Indian' || word === 'Wisdom' ? 'text-primary' : ''}>{word} </span>
            ))}
          </h1>
          <p className="font-body text-xl font-black text-on-surface/50 leading-relaxed mx-auto max-w-md">
            {steps[step].description}
          </p>
        </div>

        <div className="flex justify-center gap-3">
          {steps.map((_, i) => (
            <div key={i} className={`h-3 rounded-full transition-all duration-500 ${i === step ? 'w-16 bg-primary shadow-[0_0_10px_rgba(228,87,46,0.5)]' : 'w-3 bg-outline/20'}`}></div>
          ))}
        </div>

        <div className="flex flex-col gap-6 w-full">
          <button onClick={next} className="h-20 w-full bg-primary text-white font-headline font-black text-2xl rounded-[30px] shadow-2xl border-b-8 border-black/20 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-4 group">
            {step === steps.length - 1 ? 'Start Journey' : 'Next Insight'}
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </button>
          <button onClick={onComplete} className="h-20 w-full bg-transparent text-on-surface font-headline font-black text-2xl rounded-[30px] border-4 border-outline hover:bg-surface transition-all shadow-lg">
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
};

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background grain-texture p-10 text-center relative overflow-hidden">
      <FloatingMandala />
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: -2 }}
        transition={{ type: "spring", damping: 12, stiffness: 100 }}
        className="relative p-10 bg-surface rounded-[50px] shadow-2xl border-8 border-outline transform group"
      >
        <div className="absolute -inset-4 border-4 border-primary rounded-[60px] opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr5X2RM2KHo9g1OQ45kMhGfcnCunIx-5BlzKEXbMr9vwmIOdyqj1ol_bw3dS0sFNegN1anWGntDEw1zck_BelvdHE8mAeT8qBLvwloKPG52o7Z_VxQM_U-fhoXQh72W_LmKCNtlGH9ds4sMp5YXjBQ6ONSZijZ7NHCTjeeAMULLTjrnOrFdHAL72uOcdKvkn9IdYfFbSlTFU14XQpF59ypn7A2417a9R40bMbdNLTCXJ2fvyXGRzd4FW14BtIk8NC0T8dtH66oAEI" 
          alt="Logo" 
          className="w-56 h-56 object-contain"
        />
      </motion.div>
      <div className="mt-12 space-y-4 z-10">
        <h2 className="font-headline text-7xl font-black text-on-surface leading-none tracking-tighter uppercase">Veda Vani</h2>
        <div className="h-2 w-32 bg-primary mx-auto rounded-full shadow-[0_0_15px_rgba(228,87,46,0.5)]"></div>
        <p className="font-label text-primary font-black tracking-[0.4em] text-lg uppercase pt-4">Ancient Wisdom • Modern Mind</p>
      </div>
      <button 
        onClick={onFinish}
        className="mt-16 bg-secondary text-on-surface h-20 px-12 font-headline font-black text-2xl rounded-[30px] flex items-center justify-center gap-4 shadow-2xl border-b-8 border-black/20 hover:bg-secondary/90 transition-all active:scale-95 z-10 group"
      >
        Enter the Mela
        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { user, token, loading: authLoading, logout, isGuest, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<string>('Checking...');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path.startsWith('/search')) setActiveTab('search');
    else if (path.startsWith('/library')) setActiveTab('library');
    else if (path.startsWith('/bookmarks')) setActiveTab('bookmarks');
    else if (path.startsWith('/profile')) setActiveTab('profile');
  }, [location.pathname]);

  // Check Database Status
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setDbStatus(data.database || 'Unknown');
      } catch (err) {
        setDbStatus('Error connecting to backend');
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Persistent State
  const [favorites, setFavorites] = useState<UserFavorites>(() => getStorageItem(STORAGE_KEYS.FAVORITES, {}));
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [progress, setProgress] = useState<UserProgress>({});

  // Fetch Progress and Bookmarks from Backend
  useEffect(() => {
    const fetchData = async () => {
      if (!token || isGuest) return;

      try {
        // Fetch Progress
        const progressRes = await fetch('/api/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const progressData = await progressRes.json();
        if (progressData.status === 'success') {
          const progressMap: UserProgress = {};
          progressData.data.forEach((p: any) => {
            if (p.book) {
              progressMap[p.book._id || p.book] = p.page;
            }
          });
          setProgress(progressMap);
        }

        // Fetch Bookmarks
        const bookmarksRes = await fetch('/api/bookmarks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookmarksData = await bookmarksRes.json();
        if (bookmarksData.status === 'success') {
          setBookmarks(bookmarksData.data);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchData();
  }, [token, isGuest]);

  useEffect(() => {
    if (!authLoading) {
      const publicPaths = ['/login', '/signup'];
      const isPublicPath = publicPaths.includes(location.pathname);
      
      if (!isAuthenticated && !isPublicPath) {
        navigate('/login');
      } else if (isAuthenticated && isPublicPath) {
        navigate('/');
      }
    }
  }, [isAuthenticated, authLoading, location.pathname, navigate]);

  useEffect(() => {
    if (!isGuest) {
      setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
    }
  }, [favorites, isGuest]);

  useEffect(() => {
    if (!isGuest) {
      setStorageItem(STORAGE_KEYS.BOOKMARKS, bookmarks);
    }
  }, [bookmarks, isGuest]);

  useEffect(() => {
    if (!isGuest) {
      setStorageItem(STORAGE_KEYS.PROGRESS, progress);
    }
  }, [progress, isGuest]);

  const toggleFavorite = (bookId: string) => {
    const newFavorites = {
      ...favorites,
      [bookId]: !favorites[bookId]
    };
    setFavorites(newFavorites);
    setStorageItem(STORAGE_KEYS.FAVORITES, newFavorites);
  };

  const handleBookmarkToggle = async (bookId: string, pageIndex: number, content: string) => {
    if (isGuest || !token) return;

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, page: pageIndex, content })
      });

      if (response.ok) {
        const resData = await response.json();
        // Refresh bookmarks
        const bookmarksRes = await fetch('/api/bookmarks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookmarksData = await bookmarksRes.json();
        if (bookmarksData.status === 'success') {
          setBookmarks(bookmarksData.data);
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleProgressUpdate = async (bookId: string, pageIndex: number) => {
    setProgress(prev => ({
      ...prev,
      [bookId]: pageIndex
    }));

    if (isGuest || !token) return;

    try {
      await fetch(`/api/progress/${bookId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ page: pageIndex })
      });
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        let booksList = await response.json();

        if (!Array.isArray(booksList)) {
          booksList = [];
        }

        // If no books in DB, seed with initial content
        // Seed or update books
        if (booksList.length < 3) {
          for (const book of INITIAL_BOOKS) {
            const existingBook = booksList.find(b => b.title === book.title);
            if (!existingBook) {
              const res = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)
              });
              const savedBook = await res.json();
              booksList.push(savedBook);
            } else if (existingBook.cover !== book.cover) {
              // Update existing book if it has old or broken cover
              const res = await fetch(`/api/books/${existingBook._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...book, _id: existingBook._id })
              });
              const updatedBook = await res.json();
              const idx = booksList.findIndex(b => b._id === existingBook._id);
              booksList[idx] = updatedBook;
            }
          }
        }

        setBooks(booksList);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Global scroll reset on navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [activeTab, selectedBook?._id, isReading, showSplash, showOnboarding]);

  const handleSelectBook = (book: Book) => {
    if (book.title.toLowerCase().includes('bhagavad gita')) {
      navigate('/book/bhagavad-gita');
    } else {
      setSelectedBook(book);
    }
  };

  const getBookmarkedPages = (bookId: string) => {
    return bookmarks
      .filter(b => {
        if (!b.book) return false;
        const bId = typeof b.book === 'object' ? b.book._id : b.book;
        return bId === bookId;
      })
      .map(b => b.page);
  };

  const renderScreen = () => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background grain-texture">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-outline rounded-full animate-spin border-t-primary shadow-xl"></div>
          </div>
          <p className="mt-8 font-headline text-2xl font-black text-on-surface uppercase tracking-widest animate-pulse">Summoning Wisdom...</p>
        </div>
      );
    }

    if (location.pathname === '/login') {
      return <LoginScreen />;
    }
    if (location.pathname === '/signup') {
      return <SignupScreen />;
    }
    
    if (location.pathname === '/book/bhagavad-gita') {
      const gitaBook = books.find(b => b.title.toLowerCase().includes('bhagavad gita'));
      return (
        <BhagavadGitaPage 
          onBack={() => navigate('/')} 
          book={gitaBook}
          isFavorite={gitaBook ? !!favorites[gitaBook._id] : false}
          onToggleFavorite={() => gitaBook && toggleFavorite(gitaBook._id)}
        />
      );
    }

    if (location.pathname === '/account') return <AccountPage />;
    if (location.pathname === '/subscription') return <SubscriptionPage />;
    if (location.pathname === '/notifications') return <NotificationsPage />;
    if (location.pathname === '/privacy') return <PrivacyPage />;
    
    if (showSplash) return <SplashScreen onFinish={() => { setShowSplash(false); setShowOnboarding(true); }} />;
    if (showOnboarding) return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
    
    if (isReading && selectedBook) {
      return (
        <ReadingScreen 
          book={selectedBook} 
          onBack={() => setIsReading(false)} 
          initialPage={progress[selectedBook._id] || 0}
          onProgressUpdate={(pageIndex) => handleProgressUpdate(selectedBook._id, pageIndex)}
          onBookmarkToggle={(pageIndex, content) => { handleBookmarkToggle(selectedBook._id, pageIndex, content); }}
          bookmarkedPages={getBookmarkedPages(selectedBook._id)}
        />
      );
    }

    if (selectedBook) {
      return (
        <DetailScreen 
          book={selectedBook} 
          onBack={() => setSelectedBook(null)} 
          onStartReading={() => setIsReading(true)}
          isFavorite={!!favorites[selectedBook._id]}
          onToggleFavorite={() => toggleFavorite(selectedBook._id)}
          lastPage={progress[selectedBook._id] || 0}
        />
      );
    }

    if (loading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background grain-texture">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-outline rounded-full animate-spin border-t-primary shadow-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-secondary rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-8 font-headline text-2xl font-black text-on-surface uppercase tracking-widest animate-pulse">Summoning Wisdom...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen books={books} onSelectBook={handleSelectBook} progress={progress} onMenu={() => setIsSidebarOpen(true)} setActiveTab={setActiveTab} />;
      case 'search':
        return <SearchPage onSelectBook={handleSelectBook} onMenu={() => setIsSidebarOpen(true)} />;
      case 'library':
        return (
          <LibraryScreen 
            books={books} 
            onSelectBook={handleSelectBook} 
            favorites={favorites}
            progress={progress}
            onMenu={() => setIsSidebarOpen(true)}
            setActiveTab={setActiveTab}
          />
        );
      case 'bookmarks':
        return (
          <BookmarksScreen 
            bookmarks={bookmarks} 
            favorites={favorites}
            books={books}
            onSelectBook={handleSelectBook}
            onMenu={() => setIsSidebarOpen(true)}
          />
        );
      case 'profile':
        return <ProfileScreen onMenu={() => setIsSidebarOpen(true)} />;
      default:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-background grain-texture p-10 text-center">
            <div className="w-32 h-32 bg-error/10 rounded-[40px] flex items-center justify-center text-error mb-8">
              <BookOpen className="w-16 h-16" />
            </div>
            <h2 className="font-headline text-4xl font-black text-on-surface mb-4">Manuscript Not Found</h2>
            <p className="font-body text-xl text-on-surface/50 max-w-md mb-10">The sacred scroll you seek has vanished into the cosmic void.</p>
            <button 
              onClick={() => { setActiveTab('home'); setSelectedBook(null); }}
              className="bg-primary text-white px-10 py-5 rounded-2xl font-label text-sm font-black uppercase tracking-widest shadow-xl"
            >
              Return to Temple
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/20 grain-texture">
      {(isAuthenticated || isGuest) && !selectedBook && !showSplash && !showOnboarding && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onNavigate={(tab) => {
            const paths: Record<string, string> = {
              home: '/',
              search: '/search',
              library: '/library',
              bookmarks: '/bookmarks',
              profile: '/profile'
            };
            setActiveTab(tab);
            navigate(paths[tab] || '/');
          }}
          logout={logout}
        />
      )}
      
      {isGuest && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md text-white py-2 px-4 text-center text-[10px] font-black uppercase tracking-[0.3em] shadow-lg">
          Browsing as Guest Seeker
        </div>
      )}
      
      {dbStatus.includes('Error') && (
        <div className={`fixed ${isGuest ? 'top-8' : 'top-0'} left-0 right-0 z-50 bg-error/90 backdrop-blur-md text-white py-2 px-4 text-center text-[10px] font-black uppercase tracking-[0.3em] shadow-lg flex items-center justify-center gap-2`}>
          <Shield className="w-3 h-3" />
          MongoDB Offline: {dbStatus.replace('Error: ', '')}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={showSplash ? 'splash' : showOnboarding ? 'onboarding' : selectedBook ? selectedBook._id : location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <Routes location={location}>
            <Route path="/library" element={<Library />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/book/:id" element={<BookReader />} />
            <Route path="*" element={renderScreen()} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!selectedBook && !showSplash && !showOnboarding && 
       location.pathname !== '/login' && 
       location.pathname !== '/signup' && 
       (isAuthenticated || isGuest) && (
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}
