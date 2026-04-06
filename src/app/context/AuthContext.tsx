import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('cafebyte-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication - in production, this would call Firebase Auth
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isAdmin = email.includes('admin');
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      phone: '1234567890',
      role: isAdmin ? 'admin' : 'user',
      createdAt: Date.now(),
    };

    setUser(mockUser);
    localStorage.setItem('cafebyte-user', JSON.stringify(mockUser));
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      phone,
      role: 'user',
      createdAt: Date.now(),
    };

    setUser(mockUser);
    localStorage.setItem('cafebyte-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cafebyte-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
