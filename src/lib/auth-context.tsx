import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from './api';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string) => Promise<void>;
  verifySignup: (email: string, code: string) => Promise<void>;
  signin: (email: string) => Promise<void>;
  verifySignin: (email: string, code: string) => Promise<void>;
  signout: () => void;
  githubSignin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      // TODO: Verify token and get user info
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (email: string) => {
    try {
      setError(null);
      await authAPI.signup(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      throw err;
    }
  };

  const verifySignup = async (email: string, code: string) => {
    try {
      setError(null);
      const response = await authAPI.verifySignup(email, code);
      localStorage.setItem('accessToken', response.accessToken);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during verification');
      throw err;
    }
  };

  const signin = async (email: string) => {
    try {
      setError(null);
      await authAPI.signin(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signin');
      throw err;
    }
  };

  const verifySignin = async (email: string, code: string) => {
    try {
      setError(null);
      const response = await authAPI.verifySignin(email, code);
      localStorage.setItem('accessToken', response.accessToken);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during verification');
      throw err;
    }
  };

  const signout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const githubSignin = async () => {
    try {
      setError(null);
      const response = await authAPI.githubAuth();
      window.location.href = response.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during GitHub signin');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    verifySignup,
    signin,
    verifySignin,
    signout,
    githubSignin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 