import { api } from './api';

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

interface SignUpData {
  email: string;
  name: string;
  avatar?: string;
}

export const authService = {
  // Sign up with email
  signup: async (data: SignUpData): Promise<void> => {
    await api.post('/auth/signup', data);
  },

  // Verify signup with code
  verifySignup: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup/verify', { email, code });
    return response.data;
  },

  // Sign in with email
  signin: async (email: string): Promise<void> => {
    await api.post('/auth/signin', { email });
  },

  // Verify signin with code
  verifySignin: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin/verify', { email, code });
    return response.data;
  },
}; 