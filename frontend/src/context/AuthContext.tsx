'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiFetch<User>(`/api/users/me`, {}, true)
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ access_token: string }>(`/api/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', res.access_token);
    const user = await apiFetch<User>(`/api/users/me`, {}, true);
    setUser(user);
  };

  const register = async (username: string, email: string, password: string) => {
    await apiFetch(`/api/register`, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 