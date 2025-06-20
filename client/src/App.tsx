import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/auth/useAuthContext';
import Home from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import FeedPage from './pages/FeedPage';
import FilterPage from './pages/filter/FilterPage';
import CardDetails from './components/dashboard/CardDetails';
import ProfilePage from './pages/Profile';
import Places from './pages/Places';
import CreateListing from './pages/CreateListing';
import { Toaster } from './components/ui/toaster';
import { ChatPage } from './pages/ChatPage';
import './styles/main.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { Separator } from '@/components/ui/separator';
import { useUserContext } from './hooks/useUserContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { currentUser } = useUserContext();

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
            path="/filter"
            element={isAuthenticated ? <FilterPage /> : <Home />}
          />
          <Route
            path="/profile/:userId"
            element={isAuthenticated ? <ProfilePage /> : <Home />}
          />
          <Route
            path="/places"
            element={isAuthenticated ? <Places /> : <Home />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <DashboardPage /> : <Home />}
          />
          <Route path="/filter/:id" element={<CardDetails />} />

          <Route path="/host/create-listing" element={<CreateListing />} />
          <Route
            path="/chats"
            element={isAuthenticated ? <ChatPage /> : <Home />}
          />
        </Routes>

        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default App;
