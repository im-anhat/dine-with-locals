import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/auth/useAuthContext';
import Home from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import { ChatPage } from './pages/ChatPage';
import './styles/main.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { Separator } from '@/components/ui/separator';

// Socket.io
import { io, Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../../shared/types/typings';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  // useLocation for dynamic path in the TopNavbar
  const location = useLocation();
  const currentPath = location.pathname.split('/').filter(Boolean);
  if (currentPath.length === 0) {
    currentPath.push('dashboard'); // Default to "dashboard" if no path is present
  }

  // initialize socket state
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  // Initialize socket connection only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io('http://localhost:3000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      setSocket(newSocket);

      // Cleanup function to disconnect socket when component unmounts or user logs out
      return () => {
        newSocket.disconnect();
      };
    } else {
      // Disconnect socket if user is not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuthenticated]); // Only re-run effect when authentication status changes

  return (
    <SidebarProvider>
      {isAuthenticated && (
        <>
          <AppSidebar />
        </>
      )}

      {/* show the top navbar + wrap the other half of page (beside sidebar) into a div */}
      <div className="flex flex-1 flex-col">
        {isAuthenticated && (
          <>
            <TopNavbar currentPath={currentPath} />
            <Separator />
          </>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignUpPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Home />}
          />
          <Route
            path="/chat"
            element={
              isAuthenticated && socket ? (
                <ChatPage socket={socket} />
              ) : (
                <Home />
              )
            }
          />
        </Routes>
      </div>
    </SidebarProvider>
  );
};

export default App;
