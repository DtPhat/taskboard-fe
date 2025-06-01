import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (email: string) => {
    const response = await api.post('/auth/signup', { email });
    return response.data;
  },

  verifySignup: async (email: string, verificationCode: string) => {
    const response = await api.post('/auth/signup/verify', { email, verificationCode });
    return response.data;
  },

  signin: async (email: string) => {
    const response = await api.post('/auth/signin', { email });
    return response.data;
  },

  verifySignin: async (email: string, verificationCode: string) => {
    const response = await api.post('/auth/signin/verify', { email, verificationCode });
    return response.data;
  },

  githubAuth: async () => {
    const response = await api.get('/auth/github');
    return response.data;
  },

  githubCallback: async (code: string) => {
    const response = await api.post('/auth/github/callback', { code });
    return response.data;
  },
};

// Board API
export const boardAPI = {
  createBoard: async (data: { name: string; description: string }) => {
    const response = await api.post('/boards', data);
    return response.data;
  },

  getBoards: async () => {
    const response = await api.get('/boards');
    return response.data;
  },

  getBoard: async (id: string) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  updateBoard: async (id: string, data: { name: string; description: string }) => {
    const response = await api.put(`/boards/${id}`, data);
    return response.data;
  },

  deleteBoard: async (id: string) => {
    await api.delete(`/boards/${id}`);
  },

  inviteToBoard: async (boardId: string, data: { email: string }) => {
    const response = await api.post(`/boards/${boardId}/invite`, data);
    return response.data;
  },
};

// Card API
export const cardAPI = {
  getCards: async (boardId: string) => {
    const response = await api.get(`/boards/${boardId}/cards`);
    return response.data;
  },

  createCard: async (boardId: string, data: { name: string; description: string }) => {
    const response = await api.post(`/boards/${boardId}/cards`, data);
    return response.data;
  },

  getCard: async (boardId: string, cardId: string) => {
    const response = await api.get(`/boards/${boardId}/cards/${cardId}`);
    return response.data;
  },

  updateCard: async (boardId: string, cardId: string, data: { name: string; description: string }) => {
    const response = await api.put(`/boards/${boardId}/cards/${cardId}`, data);
    return response.data;
  },

  deleteCard: async (boardId: string, cardId: string) => {
    await api.delete(`/boards/${boardId}/cards/${cardId}`);
  },

  getCardsByUser: async (boardId: string, userId: string) => {
    const response = await api.get(`/boards/${boardId}/cards/user/${userId}`);
    return response.data;
  },
};

// Task API
export const taskAPI = {
  getTasks: async (boardId: string, cardId: string) => {
    const response = await api.get(`/boards/${boardId}/cards/${cardId}/tasks`);
    return response.data;
  },

  createTask: async (boardId: string, cardId: string, data: { title: string; description: string; status: string }) => {
    const response = await api.post(`/boards/${boardId}/cards/${cardId}/tasks`, data);
    return response.data;
  },

  getTask: async (boardId: string, cardId: string, taskId: string) => {
    const response = await api.get(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`);
    return response.data;
  },

  updateTask: async (boardId: string, cardId: string, taskId: string, data: { title: string; description: string; status: string }) => {
    const response = await api.put(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (boardId: string, cardId: string, taskId: string) => {
    await api.delete(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`);
  },

  assignMember: async (boardId: string, cardId: string, taskId: string, memberId: string) => {
    const response = await api.post(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`, { memberId });
    return response.data;
  },

  getAssignedMembers: async (boardId: string, cardId: string, taskId: string) => {
    const response = await api.get(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`);
    return response.data;
  },

  removeMember: async (boardId: string, cardId: string, taskId: string, memberId: string) => {
    await api.delete(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign/${memberId}`);
  },
};

// GitHub Integration API
export const githubAPI = {
  getRepositoryInfo: async (repositoryId: string) => {
    const response = await api.get(`/repositories/${repositoryId}/github-info`);
    return response.data;
  },

  attachToTask: async (boardId: string, cardId: string, taskId: string, data: { type: string; number: string }) => {
    const response = await api.post(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attach`, data);
    return response.data;
  },

  getTaskAttachments: async (boardId: string, cardId: string, taskId: string) => {
    const response = await api.get(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments`);
    return response.data;
  },

  removeAttachment: async (boardId: string, cardId: string, taskId: string, attachmentId: string) => {
    await api.delete(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments/${attachmentId}`);
  },
}; 