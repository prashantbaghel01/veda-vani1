import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../firebase';

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isGuest: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  continueAsGuest: () => void;
  signInWithGoogle: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isGuest, setIsGuest] = useState<boolean>(localStorage.getItem('guest') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
        };
        setUser(userData);
        setIsGuest(false);
        localStorage.removeItem('guest');
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        } else if (!isGuest) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [token, isGuest]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.removeItem('guest');
    setToken(newToken);
    setUser(newUser);
    setIsGuest(false);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guest');
    localStorage.removeItem('veda_vani_progress');
    localStorage.removeItem('veda_vani_bookmarks');
    localStorage.removeItem('veda_vani_favorites');
    setToken(null);
    setUser(null);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    // Clear ALL user-related data for a fresh start
    localStorage.clear(); 
    localStorage.setItem('guest', 'true');
    setIsGuest(true);
    setToken(null);
    setUser(null);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Call backend to get JWT token
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          googleId: firebaseUser.uid,
          photoURL: firebaseUser.photoURL
        })
      });

      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
      } else {
        throw new Error(data.message || 'Google Login failed on server');
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isGuest,
      login, 
      logout, 
      continueAsGuest,
      signInWithGoogle,
      isAuthenticated: !!token || isGuest || !!user, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
