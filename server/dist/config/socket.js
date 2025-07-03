import { Server as SocketIOServer } from 'socket.io';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.SECRET;
export const initializeSocket = (server) => {
    const io = new SocketIOServer(server, {
        pingTimeout: 60000,
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    // 1. Authentication middleware for websocket, i fixed so it verifies the user correctly
    io.use(async (socket, next) => {
        const userId = socket.handshake.query.userId;
        const token = socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error: token are required'));
        }
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment');
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET || 'default');
            const user = await User.findById(decoded._id).select('-password');
            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }
            socket.userId = user._id;
            socket.user = user; // Store user data in socket for later use
            next();
        }
        catch (error) {
            console.error('Socket authentication error:', error);
            return next(new Error('Authentication error: Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`User ${socket.userId} connected (Socket ID: ${socket.id})`);
        // -- NOTIFICATIONS --
        // Join user to their personal notification room
        if (socket.userId) {
            socket.join(`user_${socket.userId}`);
            console.log(`User ${socket.userId} joined their notification room`);
        }
        // Test event for connection verification
        socket.emit('connection_confirmed', {
            message: 'Successfully connected to server',
            userId: socket.userId,
            timestamp: new Date(),
        });
        // Handle test events
        socket.on('test_message', (data) => {
            console.log('Received test message:', data);
            socket.emit('test_response', {
                message: 'Server received your message',
                originalData: data,
                timestamp: new Date(),
            });
        });
        // Handle joining specific blog rooms
        socket.on('join_blog', (blogId) => {
            socket.join(`blog_${blogId}`);
            console.log(`User ${socket.userId} joined blog room: ${blogId}`);
            // Notify others in the room
            socket.to(`blog_${blogId}`).emit('user_joined_blog', {
                userId: socket.userId,
                blogId,
                message: `User ${socket.userId} joined the blog discussion`,
            });
            // Confirm to the user
            socket.emit('blog_room_joined', {
                blogId,
                message: `Successfully joined blog room: ${blogId}`,
            });
        });
        // Handle leaving blog rooms
        socket.on('leave_blog', (blogId) => {
            socket.leave(`blog_${blogId}`);
            console.log(`User ${socket.userId} left blog room: ${blogId}`);
            // Notify others in the room
            socket.to(`blog_${blogId}`).emit('user_left_blog', {
                userId: socket.userId,
                blogId,
                message: `User ${socket.userId} left the blog discussion`,
            });
        });
        // Handle broadcast test
        socket.on('broadcast_test', (data) => {
            console.log('Broadcasting test message:', data);
            io.emit('broadcast_received', {
                from: socket.userId,
                message: data.message,
                timestamp: new Date(),
            });
        });
        // Handle notification test
        socket.on('send_notification', (data) => {
            const { targetUserId, message, type } = data;
            console.log(`Sending notification to user ${targetUserId}:`, message);
            const notification = {
                type: type || 'test',
                message: message,
                from: socket.userId,
                timestamp: new Date(),
            };
            // Send to specific user
            io.to(`user_${targetUserId}`).emit('new_notification', notification);
            // Confirm to sender
            socket.emit('notification_sent', {
                message: `Notification sent to user ${targetUserId}`,
                notification,
            });
        });
        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
        });
        // Handle connection errors
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        // -- CHAT ROOM HANDLING --
        // a. Handle joining a chat room
        socket.on('join_chat', async (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.userId} joined chat: ${chatId}`);
            // Notify others in the chat room
            socket.to(chatId).emit('chat_joined', {
                userId: socket.userId,
                chatId,
                message: `User ${socket.userId} joined the chat`,
            });
        });
        // b. Handle leaving a chat room
        socket.on('leave_chat', (chatId) => {
            socket.leave(chatId);
            console.log(`User ${socket.userId} left chat: ${chatId}`);
            // Notify others in the chat room
            socket.to(chatId).emit('chat_left', {
                userId: socket.userId,
                chatId,
                message: `User ${socket.userId} left the chat`,
            });
        });
        // c. Handle new messages from CLIENT
        socket.on('message_send', async (data) => {
            try {
                // Check if chat exists and get chat info
                const chat = await Chat.findById(data.chatId);
                if (!chat) {
                    socket.emit('error', 'Chat not found');
                    return;
                }
                // Check if it's a group chat and if user is authorized to send messages
                if (chat.isGroupChat) {
                    if (!chat.groupAdmin ||
                        chat.groupAdmin.toString() !== socket.userId.toString()) {
                        socket.emit('error', 'Only the host can send messages in this group chat.');
                        return;
                    }
                }
                // Create new message
                const newMessage = {
                    senderId: socket.userId,
                    content: data.content,
                    chat: data.chatId,
                };
                // Save message to database
                let message = await Message.create(newMessage);
                // Update chat's latest message
                await Chat.findByIdAndUpdate(data.chatId, {
                    latestMessage: message,
                });
                // populate the message with the senderId and chat
                message = await message.populate('senderId', '_id firstName');
                // broadcast to all users in the chat
                io.to(data.chatId).emit('message_created', message);
                console.log('message_created', message);
            }
            catch (error) {
                console.error('Error saving message:', error);
                socket.emit('error', 'Failed to send message');
            }
        });
    });
    return io;
};
