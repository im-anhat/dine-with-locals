import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './UserContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: any[];
  unreadCount: number;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  notifications: [],
  unreadCount: 0,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useUser();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!currentUser?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const socketInstance = io('http://localhost:3000', {
      query: { userId: currentUser._id },
      withCredentials: true,
    });

    setSocket(socketInstance);

    // Socket event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('new_notification', (notification: any) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socketInstance.on('connection_confirmed', (data: any) => {
      console.log('Connection confirmed:', data);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      notifications,
      unreadCount
    }}>
      {children}
    </SocketContext.Provider>
  );
};
