import { IChat } from '../models/Message.js';

export interface ServerToClientEvents {
  // New message event
  'message:new': (message: {
    _id: string;
    senderId: {
      _id: string;
      userName: string;
      firstName: string;
      lastName: string;
      avatar: string;
      role: string;
    };
    content: string;
    chat: {
      _id: string;
      users: Array<{
        _id: string;
        userName: string;
        firstName: string;
        lastName: string;
        avatar: string;
        role: string;
      }>;
    };
    readBy: string[];
    createdAt: Date;
    updatedAt: Date;
  }) => void;

  // Error event
  error: (message: string) => void;

  // Connection events
  connect: () => void;
  disconnect: () => void;
}

export interface ClientToServerEvents {
  'join:chat': (chatId: string) => void;
  'leave:chat': (chatId: string) => void;
  'message:send': (data: { chatId: string; content: string }) => void;

  'typing:start': (chatId: string) => void;
  'typing:end': (chatId: string) => void;
}

export interface SocketData {
  userId: string;
  userName: string;
}
