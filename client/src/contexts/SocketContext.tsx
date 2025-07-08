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
        console.log('User logged out, disconnecting socket');
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setNotifications([]);
        setUnreadCount(0);
      }
      return;
    }

    console.log('Initializing socket connection for user:', currentUser._id);

    // Initialize socket connection
    const socketInstance = io(
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
      {
        query: {
          userId: currentUser._id,
          token: localStorage.getItem('token'),
        }, // this sends the userId as param for auth in BE
        withCredentials: true,
        forceNew: true, // Force a new connection
      },
    );

    setSocket(socketInstance);

    // Socket event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected with ID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected. Reason:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connection_confirmed', (data: any) => {
      console.log('Connection confirmed by server:', data);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    // Cleanup on unmount or user change
    return () => {
      console.log('Cleaning up socket connection');
      socketInstance.disconnect();
    };
  }, [currentUser?._id]); // Only re-run when currentUser._id changes

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        unreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
