import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { continueAsGuest, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGuestContinue = () => {
    continueAsGuest();
    navigate('/', { replace: true });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/signup', { name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen flex flex-col font-body text-on-surface antialiased relative overflow-hidden">
      {/* Background Motifs */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <div className="w-full h-full mandala-bg animate-rotate-slow"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5 pointer-events-none">
        <div className="w-full h-full mandala-bg animate-rotate-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6 border border-primary/20"
            >
              <BookOpen className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="font-headline font-black text-5xl text-on-surface tracking-tight mb-3">Veda Vani</h1>
            <p className="font-body text-primary font-bold text-xs tracking-[0.3em] uppercase">Begin Your Spiritual Journey</p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[32px] shadow-[0_30px_70px_-15px_rgba(46,21,0,0.12)] border border-outline/30 overflow-hidden"
          >
            <div className="flex bg-surface/30">
              <Link to="/login" className="flex-1 py-6 text-sm font-black uppercase tracking-widest text-on-surface/30 hover:text-on-surface/60 transition-all text-center">
                Login
              </Link>
              <button className="flex-1 py-6 text-sm font-black uppercase tracking-widest text-primary border-b-4 border-primary transition-all">
                Signup
              </button>
            </div>

            <div className="p-10">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-8 p-5 bg-error/5 border-l-4 border-error rounded-r-2xl flex items-center gap-4 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-error text-sm font-bold">{error}</p>
                </motion.div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/40 ml-1" htmlFor="name">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-on-surface/20 group-focus-within:text-primary transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input 
                      className="w-full bg-surface/30 border-2 border-outline/20 focus:border-primary focus:bg-white focus:ring-0 rounded-2xl pl-14 pr-6 py-5 transition-all duration-300 placeholder-on-surface/20 text-on-surface font-medium shadow-sm" 
                      id="name" 
                      placeholder="Arjun Sharma" 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/40 ml-1" htmlFor="email">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-on-surface/20 group-focus-within:text-primary transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input 
                      className="w-full bg-surface/30 border-2 border-outline/20 focus:border-primary focus:bg-white focus:ring-0 rounded-2xl pl-14 pr-6 py-5 transition-all duration-300 placeholder-on-surface/20 text-on-surface font-medium shadow-sm" 
                      id="email" 
                      placeholder="wisdom@vedavani.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/40 ml-1" htmlFor="password">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-on-surface/20 group-focus-within:text-primary transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input 
                        className="w-full bg-surface/30 border-2 border-outline/20 focus:border-primary focus:bg-white focus:ring-0 rounded-2xl pl-14 pr-6 py-5 transition-all duration-300 placeholder-on-surface/20 text-on-surface font-medium shadow-sm" 
                        id="password" 
                        placeholder="••••••••" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/40 ml-1" htmlFor="confirm-password">Confirm</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-on-surface/20 group-focus-within:text-primary transition-colors">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <input 
                        className="w-full bg-surface/30 border-2 border-outline/20 focus:border-primary focus:bg-white focus:ring-0 rounded-2xl pl-14 pr-6 py-5 transition-all duration-300 placeholder-on-surface/20 text-on-surface font-medium shadow-sm" 
                        id="confirm-password" 
                        placeholder="••••••••" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase shadow-[0_15px_30px_-10px_rgba(228,87,46,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(228,87,46,0.5)] hover:-translate-y-1 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Begin Journey
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center my-10">
                <div className="flex-grow h-px bg-outline/20"></div>
                <span className="px-6 text-[10px] font-black text-on-surface/20 uppercase tracking-[0.4em]">Or Divine Path</span>
                <div className="flex-grow h-px bg-outline/20"></div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-4 py-5 border-2 border-outline/20 rounded-2xl text-xs font-black uppercase tracking-widest text-on-surface/60 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group shadow-sm active:scale-95"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
                  Sign up with Google
                </button>
                
                <button 
                  onClick={handleGuestContinue}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-secondary/10 border-2 border-secondary/20 rounded-2xl text-xs font-black uppercase tracking-widest text-primary hover:bg-secondary/20 transition-all duration-300 group shadow-sm active:scale-95"
                >
                  <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                  Wander as Guest Seeker
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mt-12 text-center">
            <p className="text-on-surface/40 text-sm font-medium">
              Already a seeker? <Link className="font-black text-primary hover:underline transition-all underline-offset-4 ml-1" to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-10 mt-auto flex flex-col items-center justify-center text-center px-8 border-t border-outline/10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/20 mb-6">
          © 2024 Veda Vani • Ancient Wisdom, Modern Mind
        </p>
        <div className="flex gap-8">
          <a className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 hover:text-primary transition-colors" href="#">Terms</a>
          <a className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default SignupScreen;
