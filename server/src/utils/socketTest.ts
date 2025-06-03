// server/src/utils/socketTest.ts
import { io } from 'socket.io-client';

// Create a test client
const socket = io('http://localhost:3000', {
  query: {
    userId: 'test-user-' + Date.now(),
  },
});

// Listen for connection events
socket.on('connect', () => {
  console.log('Connected to server with socket ID:', socket.id);

  // Test sending a broadcast message
  socket.emit('broadcast_test', {
    message: 'Hello from test client!',
  });

  // Test sending a notification
  socket.emit('send_notification', {
    targetUserId: 'test-user-' + Date.now(),
    message: 'Test notification',
    type: 'info',
  });
});

socket.on('connection_confirmed', (data) => {
  console.log('Server confirmed connection:', data);
});

socket.on('broadcast_received', (data) => {
  console.log('Broadcast received:', data);
});

socket.on('notification_sent', (data) => {
  console.log('Notification sent:', data);
});

socket.on('new_notification', (data) => {
  console.log('New notification received:', data);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from server:', reason);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Keep the script running for a while to receive messages
setTimeout(() => {
  console.log('Test complete, disconnecting...');
  socket.disconnect();
}, 10000);
