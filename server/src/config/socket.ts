// server/src/config/socket.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends SocketIOServer {
  userId?: string;
}

export const initializeSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket: any, next) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.userId = userId;
      next();
    } else {
      next(new Error('Authentication error: userId is required'));
    }
  });

  io.on('connection', (socket: any) => {
    console.log(`User ${socket.userId} connected (Socket ID: ${socket.id})`);

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
    socket.on('test_message', (data: any) => {
      console.log('Received test message:', data);
      socket.emit('test_response', {
        message: 'Server received your message',
        originalData: data,
        timestamp: new Date(),
      });
    });

    // Handle joining specific blog rooms
    socket.on('join_blog', (blogId: string) => {
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
    socket.on('leave_blog', (blogId: string) => {
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
    socket.on('broadcast_test', (data: any) => {
      console.log('Broadcasting test message:', data);
      io.emit('broadcast_received', {
        from: socket.userId,
        message: data.message,
        timestamp: new Date(),
      });
    });

    // Handle notification test
    socket.on('send_notification', (data: any) => {
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
    socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  });

  // Log server statistics every 30 seconds
  setInterval(() => {
    console.log(`Active connections: ${io.engine.clientsCount}`);
  }, 30000);

  return io;
};
