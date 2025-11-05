'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { transactions as fallbackData } from '@/lib/data';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
  password?: string; // Should be hashed in a real app
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => void;
  register: (name: string, email: string, password?: string) => void;
  loginAsGuest: () => void;
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
      localStorage.removeItem(LAST_LOGGED_IN_USER_KEY);
      if (user?.email) {
        localStorage.removeItem(`user_${user.email}`);
      }
    }
    setLoading(false);
  }, []);
  
  const register = (name: string, email: string, password?: string) => {
    const userKey = `user_${email}`;
    const existingUser = localStorage.getItem(userKey);

    if (existingUser) {
      throw new Error('Ya existe una cuenta con este correo electrónico.');
    }

    const defaultAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');
    const userData: User = { name, email, avatarUrl: defaultAvatar?.imageUrl || '', password, isGuest: false };
    localStorage.setItem(userKey, JSON.stringify(userData));
    
    // Set initial transactions for the new user
    const transactionsKey = `transactions_${email}`;
    localStorage.setItem(transactionsKey, JSON.stringify(fallbackData));
  };


  const login = (email: string, password?: string) => {
    const userKey = `user_${email}`;
    const storedUser = localStorage.getItem(userKey);

    if (!storedUser) {
        throw new Error('El usuario no existe. Por favor, regístrese.');
    }
    
    const userData: User = JSON.parse(storedUser);

    if (userData.password !== password) {
        throw new Error('La contraseña es incorrecta.');
    }
    
    setUser(userData);
    localStorage.setItem(LAST_LOGGED_IN_USER_KEY, email);
  };
  
  const loginAsGuest = () => {
    const guestEmail = `guest_${new Date().getTime()}@micontrol.com`;
    const guestUser: User = {
        name: 'Invitado',
        email: guestEmail,
        avatarUrl: '',
        isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem(LAST_LOGGED_IN_USER_KEY, guestEmail);
    localStorage.setItem(`user_${guestEmail}`, JSON.stringify(guestUser));
    
    // Set initial transactions for the guest user
    const transactionsKey = `transactions_${guestEmail}`;
    localStorage.setItem(transactionsKey, JSON.stringify(fallbackData));
  };

  const logout = () => {
    if (user?.isGuest) {
      // Clean up guest data
      localStorage.removeItem(`user_${user.email}`);
      localStorage.removeItem(`transactions_${user.email}`);
      localStorage.removeItem(`budgets_${user.email}`);
    }
    localStorage.removeItem(LAST_LOGGED_IN_USER_KEY);
    setUser(null);
  };
  
  const updateUser = (data: Partial<User>) => {
    if (user && !user.isGuest) {
      const updatedUser = { ...user, ...data };
      const userKey = `user_${user.email}`;
      setUser(updatedUser);
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginAsGuest, logout, updateUser }}>
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
