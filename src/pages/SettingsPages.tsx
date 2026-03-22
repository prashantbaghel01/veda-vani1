import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Shield, Bell, CreditCard, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const PlaceholderPage = ({ title, icon: Icon, description }: { title: string, icon: any, description: string }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background grain-texture p-6 md:p-12 flex flex-col">
      <header className="flex items-center gap-6 mb-16 relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-surface border-2 border-outline hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        <div className="space-y-1">
          <h1 className="font-headline text-4xl font-black text-on-surface tracking-tighter uppercase">{title}</h1>
          <div className="h-1.5 w-16 bg-primary rounded-full"></div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 max-w-2xl mx-auto text-center space-y-12">
        <div className="absolute inset-0 mandala-bg opacity-[0.03] animate-rotate-slow pointer-events-none"></div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-primary/10 rounded-[40px] blur-2xl animate-pulse"></div>
          <div className="w-32 h-32 bg-surface border-4 border-outline rounded-[40px] flex items-center justify-center text-primary shadow-2xl relative z-10">
            <Icon className="w-16 h-16" />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg border-4 border-background animate-bounce">
            <Sparkles className="w-6 h-6 text-on-surface" />
          </div>
        </motion.div>

        <div className="space-y-6">
          <h2 className="font-headline text-5xl font-black text-on-surface tracking-tight">Coming Soon</h2>
          <p className="font-body text-xl md:text-2xl font-medium text-on-surface/50 leading-relaxed max-w-lg mx-auto">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full pt-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 bg-primary text-white h-20 rounded-[28px] font-headline text-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            Return to Path
          </button>
          <button 
            className="flex-1 bg-surface border-4 border-outline text-on-surface h-20 rounded-[28px] font-headline text-2xl font-black uppercase tracking-widest shadow-lg hover:bg-background transition-all active:scale-95"
          >
            Notify Me
          </button>
        </div>
      </main>

      <footer className="mt-20 text-center opacity-20">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-on-surface to-transparent mb-8"></div>
        <p className="font-label text-[10px] uppercase tracking-[0.5em] font-black">Veda Vani • Ancient Wisdom</p>
      </footer>
    </div>
  );
};

export const AccountPage = () => (
  <PlaceholderPage 
    title="Account Settings" 
    icon={User} 
    description="The account sanctuary is currently being prepared by the ancient scribes. Soon you will be able to manage your spiritual profile."
  />
);

export const SubscriptionPage = () => (
  <PlaceholderPage 
    title="Subscription" 
    icon={CreditCard} 
    description="Unlock deeper realms of wisdom. Our subscription tiers are being meticulously crafted to offer you the ultimate enlightenment."
  />
);

export const NotificationsPage = () => (
  <PlaceholderPage 
    title="Notifications" 
    icon={Bell} 
    description="Stay connected with the cosmic rhythm. We are building a notification system that alerts you to daily insights and sacred updates."
  />
);

export const PrivacyPage = () => (
  <PlaceholderPage 
    title="Privacy & Security" 
    icon={Shield} 
    description="Your spiritual journey is sacred. We are fortifying our digital temple to ensure your data remains as secure as ancient scrolls."
  />
);
