import { api } from "./api";

export interface Board {
  id: string;
  name: string;
  description: string;
  members: Member[];
}

export interface Member {
  id: string;
  email: string;
  createdAt: string;
  name: string;
  avatar: string;
}

export interface CreateBoardDto {
  name: string;
  description: string;
}

export interface UpdateBoardDto {
  name: string;
  description: string;
}

export interface AcceptInviteDto {
  inviteId: string;
  boardId: string;
  // member_id: string;
  status: "accepted" | "declined";
}

export const boardService = {
  // Create a new board
  createBoard: async (data: CreateBoardDto): Promise<Board> => {
    const response = await api.post<Board>("/boards", data);
    return response.data;
  },

  // Get all boards
  getAllBoards: async (): Promise<Board[]> => {
    const response = await api.get<Board[]>("/boards");
    return response.data;
  },

  // Get board by ID
  getBoardById: async (id: string): Promise<Board> => {
    const response = await api.get<Board>(`/boards/${id}`);
    return response.data;
  },

  // Update board
  updateBoard: async (id: string, data: UpdateBoardDto): Promise<Board> => {
    const response = await api.put<Board>(`/boards/${id}`, data);
    return response.data;
  },

  // Delete board
  deleteBoard: async (id: string): Promise<void> => {
    await api.delete(`/boards/${id}`);
  },

  // Invite member to board
  inviteMember: async (
    boardId: string,
    data: {
      board_owner_id: string;
      member_id: string;
      email_member?: string;
      status: "pending" | "accepted" | "declined";
    }
  ): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>(
      `/boards/${boardId}/invite`,
      data
    );
    return response.data;
  },

  // Accept board invitation
  acceptInvite: async (
    data: AcceptInviteDto
  ): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>(
      `/boards/${data.boardId}/invite/accept`,
      data
    );
    return response.data;
  },
};
