import { io, Socket } from 'socket.io-client';
import { AcceptInviteDto } from './boardService';

export interface Notification {
  id: string;
  type: 'board_invite';
  title: string;
  message: string;
  data: {
    invite_id: string;
    board_id: string;
    board_name: string;
    inviter_name: string;
  };
  createdAt: string;
  read: boolean;
}

class NotificationService {
  private socket: Socket | null = null;
  private listeners: ((notification: Notification) => void)[] = [];

  connect(userId: string) {
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      query: { userId }
    });

    this.socket.on('notification', (notification: Notification) => {
      this.listeners.forEach(listener => listener(notification));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  addListener(listener: (notification: Notification) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async getNotifications(): Promise<Notification[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications`);
    return response.json();
  }

  async markAsRead(notificationId: string): Promise<void> {
    await fetch(`${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  async handleInvite(data: AcceptInviteDto): Promise<void> {
    await fetch(`${import.meta.env.VITE_API_URL}/notifications/invite/handle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
}

export const notificationService = new NotificationService(); 