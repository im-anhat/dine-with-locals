import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/auth/useAuthContext';
// import { AuthProvider } from './contexts/AuthContext';
// import { UserProvider } from './contexts/UserContext';
import Home from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import FeedPage from './pages/FeedPage';
import { Toaster } from './components/ui/toaster';
import './styles/main.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { TopNavbar } from '@/components/TopNavbar';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  console.log(isAuthenticated);

  // useLocation for dynamic path in the TopNavbar
  const location = useLocation();
  const currentPath = location.pathname.split('/').filter(Boolean);
  if (currentPath.length === 0) {
    currentPath.push('dashboard'); // Default to "dashboard" if no path is present
  }
  console.log('Current path:', currentPath);

  return (
    // moved BrowserRouter from main.tsx to here
    <SidebarProvider>
      {isAuthenticated && (
        <>
          <AppSidebar />
          <SidebarTrigger />
          <TopNavbar currentPath={currentPath} />
          <Separator />
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
        <Route path="/" element={<Home />} />
      </Routes>

      <Toaster />
    </SidebarProvider>
  );
};

export default App;
