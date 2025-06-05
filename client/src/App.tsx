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
import { useUserContext } from './hooks/useUserContext';
import { useSocket } from './contexts/SocketContext';

// Socket.io
// import { io, Socket } from 'socket.io-client';
// import {
//   ServerToClientEvents,
//   ClientToServerEvents,
// } from '../../shared/types/typings';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { currentUser } = useUserContext();
  const { socket } = useSocket();

  // useLocation for dynamic path in the TopNavbar
  const location = useLocation();
  const currentPath = location.pathname.split('/').filter(Boolean);
  if (currentPath.length === 0) {
    currentPath.push('dashboard'); // Default to "dashboard" if no path is present
  }

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
            element={isAuthenticated ? <ChatPage /> : <Home />}
          />
        </Routes>
      </div>
    </SidebarProvider>
  );
};

export default App;
