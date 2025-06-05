import { api } from './api';

export interface Card {
  id: string;
  name: string;
  description: string;
  tasks_count?: number;
  list_member?: string[];
  createdAt?: string;
}

export interface CreateCardDto {
  name: string;
  description: string;
  createdAt?: string;
}

export interface UpdateCardDto {
  name: string;
  description: string;
  params?: Record<string, any>;
}

export const cardService = {
  // Get all cards for a board
  getAllCards: async (boardId: string): Promise<Card[]> => {
    const response = await api.get<Card[]>(`/boards/${boardId}/cards`);
    return response.data;
  },

  // Create a new card
  createCard: async (boardId: string, data: CreateCardDto): Promise<Card> => {
    const response = await api.post<Card>(`/boards/${boardId}/cards`, data);
    return response.data;
  },

  // Get card by ID
  getCardById: async (boardId: string, cardId: string): Promise<Card> => {
    const response = await api.get<Card>(`/boards/${boardId}/cards/${cardId}`);
    return response.data;
  },

  // Get cards by user
  getCardsByUser: async (boardId: string, userId: string): Promise<Card[]> => {
    const response = await api.get<Card[]>(`/boards/${boardId}/cards/user/${userId}`);
    return response.data;
  },

  // Update card
  updateCard: async (boardId: string, cardId: string, data: UpdateCardDto): Promise<Card> => {
    const response = await api.put<Card>(`/boards/${boardId}/cards/${cardId}`, data);
    return response.data;
  },

  // Delete card
  deleteCard: async (boardId: string, cardId: string): Promise<void> => {
    await api.delete(`/boards/${boardId}/cards/${cardId}`);
  },

  // Accept card invitation
  acceptCardInvite: async (boardId: string, cardId: string, data: {
    invite_id: string;
    card_id: string;
    member_id: string;
    status: 'accepted' | 'declined';
  }): Promise<void> => {
    await api.post(`/boards/${boardId}/cards/${cardId}/invite/accept`, data);
  },
}; 