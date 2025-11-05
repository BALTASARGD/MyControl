'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LAST_LOGGED_IN_USER_KEY = 'lastLoggedInUser';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const lastUserEmail = localStorage.getItem(LAST_LOGGED_IN_USER_KEY);
      if (lastUserEmail) {
        const storedUser = localStorage.getItem(`user_${lastUserEmail}`);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      // Clear potentially corrupted keys
      localStorage.removeItem(LAST_LOGGED_IN_USER_KEY);
      if (user?.email) {
        localStorage.removeItem(`user_${user.email}`);
      }
    }
    setLoading(false);
  }, []);

  const login = (name: string, email: string) => {
    const defaultAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');
    const userData = { name, email, avatarUrl: defaultAvatar?.imageUrl || '' };
    const userKey = `user_${email}`;
    
    localStorage.setItem(userKey, JSON.stringify(userData));
    localStorage.setItem(LAST_LOGGED_IN_USER_KEY, email);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(LAST_LOGGED_IN_USER_KEY);
    // No es necesario eliminar la clave `user_...`, puede permanecer para un futuro inicio de sesión.
    setUser(null);
  };
  
  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      const userKey = `user_${user.email}`;
      setUser(updatedUser);
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
