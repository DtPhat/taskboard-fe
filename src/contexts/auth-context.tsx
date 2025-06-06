import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface SignUpData {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signup: (data: SignUpData) => Promise<void>;
  signin: (email: string) => Promise<void>;
  verifySignin: (email: string, code: string) => Promise<void>;
  signout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (accessToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  const signupMutation = useMutation({
    mutationFn: (data: SignUpData) => authService.signup(data),
    onError: (err) => {
      setError("Failed to send verification code");
    },
  });

  const signinMutation = useMutation({
    mutationFn: authService.signin,
    onError: (err) => {
      setError("Failed to send verification code");
    },
  });

  const verifySigninMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authService.verifySignin(email, code),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setError(null);
    },
    onError: () => {
      setError("Invalid verification code");
    },
  });

  const signup = async (data: SignUpData) => {
    setError(null);
    await signupMutation.mutateAsync(data);
  };

  const signin = async (email: string) => {
    setError(null);
    await signinMutation.mutateAsync(email);
  };

  const verifySignin = async (email: string, code: string) => {
    setError(null);
    await verifySigninMutation.mutateAsync({ email, code });
  };

  const signout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    signup,
    signin,
    verifySignin,
    signout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
