import React from 'react';
import './styles/main.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Toaster } from './components/ui/toaster';
import { UserProvider } from './contexts/UserContext';
import { useAuthContext } from './hooks/auth/useAuthContext';

import Places from './pages/Places';
import Home from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import FeedPage from './pages/FeedPage';

//The type React.FC is a type definition for type checking for functional components
//and ensures that children are implicitly typed
const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  console.log(isAuthenticated);

  return (
    // moved BrowserRouter from main.tsx to here
    <SidebarProvider>
      {isAuthenticated && (
        <>
          <AppSidebar />
          <SidebarTrigger />
        </>
      )}

      <Routes>
        {/* to-be-replaced with future pages from src/pages and paths (in AppSidebar) */}
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
          path="/feed"
          element={isAuthenticated ? <FeedPage /> : <Home />}
        />
        <Route
          path="/places"
          element={isAuthenticated ? <Places /> : <Home />}
        />
        <Route path="/" element={<Home />} />
      </Routes>
      <Toaster />
    </SidebarProvider>
  );
};

export default App;
