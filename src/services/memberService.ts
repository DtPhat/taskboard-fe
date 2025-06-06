import { api } from './api';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateMemberDto {
  name: string;
  email: string;
}

export interface UpdateMemberDto {
  name?: string;
  email?: string;
}

export const memberService = {
  // Get all members for a board
  getBoardMembers: async (boardId: string): Promise<Member[]> => {
    const response = await api.get<Member[]>(`/boards/${boardId}/members`);
    return response.data;
  },

  // Add member to board
  addBoardMember: async (boardId: string, data: CreateMemberDto): Promise<Member> => {
    const response = await api.post<Member>(`/boards/${boardId}/members`, data);
    return response.data;
  },

  // Remove member from board
  removeBoardMember: async (boardId: string, memberId: string): Promise<void> => {
    await api.delete(`/boards/${boardId}/members/${memberId}`);
  },

  // Update member
  updateMember: async (boardId: string, memberId: string, data: UpdateMemberDto): Promise<Member> => {
    const response = await api.put<Member>(`/boards/${boardId}/members/${memberId}`, data);
    return response.data;
  }
}; 