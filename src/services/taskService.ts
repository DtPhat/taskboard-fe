import { api } from './api';

export interface Task {
  id: string;
  cardId: string;
  title: string;
  description: string;
  status: string;
  ownerId?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: string;
}

export interface UpdateTaskDto {
  id: string;
  // ownerId: string;
  newCardId?: string;
  title: string;
  description: string;
  status: string;
}

export interface GitHubAttachment {
  attachmentId: string;
  type: 'pull_request' | 'commit' | 'issue';
  number?: string;
  sha?: string;
}

export const taskService = {
  // Get all tasks for a card
  getAllTasks: async (boardId: string, cardId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/boards/${boardId}/cards/${cardId}/tasks`);
    return response.data;
  },

  // Create a new task
  createTask: async (boardId: string, cardId: string, data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>(`/boards/${boardId}/cards/${cardId}/tasks`, data);
    return response.data;
  },

  // Get task by ID
  getTaskById: async (boardId: string, cardId: string, taskId: string): Promise<Task> => {
    const response = await api.get<Task>(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`);
    return response.data;
  },

  // Update task
  updateTask: async (boardId: string, cardId: string, taskId: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.put<Task>(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, data);
    return response.data;
  },

  // Delete task
  deleteTask: async (boardId: string, cardId: string, taskId: string): Promise<void> => {
    await api.delete(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`);
  },

  // Assign member to task
  assignMember: async (boardId: string, cardId: string, taskId: string, memberId: string): Promise<{ taskId: string; memberId: string }> => {
    const response = await api.post<{ taskId: string; memberId: string }>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
      { memberId }
    );
    return response.data;
  },

  // Get assigned members
  getAssignedMembers: async (boardId: string, cardId: string, taskId: string): Promise<{ taskId: string; memberId: string }[]> => {
    const response = await api.get<{ taskId: string; memberId: string }[]>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`
    );
    return response.data;
  },

  // Remove member assignment
  removeMemberAssignment: async (boardId: string, cardId: string, taskId: string, memberId: string): Promise<void> => {
    await api.delete(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign/${memberId}`);
  },

  // Attach GitHub item to task
  attachGitHubItem: async (
    boardId: string,
    cardId: string,
    taskId: string,
    data: { type: 'pull_request' | 'commit' | 'issue'; number?: string; sha?: string }
  ): Promise<GitHubAttachment> => {
    const response = await api.post<GitHubAttachment>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attach`,
      data
    );
    return response.data;
  },

  // Get GitHub attachments
  getGitHubAttachments: async (boardId: string, cardId: string, taskId: string): Promise<GitHubAttachment[]> => {
    const response = await api.get<GitHubAttachment[]>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments`
    );
    return response.data;
  },

  // Remove GitHub attachment
  removeGitHubAttachment: async (boardId: string, cardId: string, taskId: string, attachmentId: string): Promise<void> => {
    await api.delete(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments/${attachmentId}`);
  },
}; 