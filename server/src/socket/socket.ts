import { Socket, Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../../shared/types/typings.js';

const JWT_SECRET = process.env.SECRET || 'default';

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketServer(httpServer, {
    pingTimeout: 60000,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // 1. Authentication middleware for websocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };

      // Get user from database
      const user = await User.findById(decoded._id).select('-password');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Set user data in socket
      socket.data.userId = user._id;
      socket.data.user = user;

      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // 2. Socket.io connection handler
  io.on(
    'connection',
    (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      console.log('User connected:', socket.id);

      // -- a. Handle joining a chat room
      socket.on('join:chat', async (chatId: string) => {
        socket.join(chatId);
        console.log(`User ${socket.data.userId} joined chat: ${chatId}`);
      });

      // -- b. Handle leaving a chat room
      socket.on('leave:chat', (chatId: string) => {
        socket.leave(chatId);
        console.log(`User ${socket.data.userId} left chat: ${chatId}`);
      });

      // -- c. Handle new messages from CLIENT
      socket.on(
        'message:send',
        async (data: { chatId: string; content: string }) => {
          try {
            // Create new message
            const newMessage = {
              senderId: socket.data.userId,
              content: data.content,
              chat: data.chatId,
              readBy: [socket.data.userId],
            };

            // Save message to database
            let message = await Message.create(newMessage);

            // Populate the message with sender and chat details
            message = await message.populate(
              'senderId',
              '_id userName firstName lastName phone avatar role',
            );
            message = await message.populate('chat');
            message = await message.populate({
              path: 'chat.users',
              select: '_id userName firstName lastName phone avatar role',
            });

            // Update chat's latest message
            await Chat.findByIdAndUpdate(data.chatId, {
              latestMessage: message,
            });

            // Broadcast to all users in the chat
            io.to(data.chatId).emit('message:new', message);
            console.log('message:new', message);
          } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', 'Failed to send message');
          }
        },
      );

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    },
  );

  return io;
};
