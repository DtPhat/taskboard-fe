import { api } from './api';

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

export const authService = {
  signin: async (email: string): Promise<void> => {
    await api.post('/auth/signin', { email });
  },

  verifySignin: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin/verify', { email, code });
    return response.data;
  },
}; 