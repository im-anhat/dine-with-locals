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
import { Toaster } from './components/ui/toaster';
import './styles/main.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { TopNavbar } from '@/components/TopNavbar';
import { useUserContext } from './hooks/useUserContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { currentUser } = useUserContext();

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
            path="/profile"
            element={
              isAuthenticated ? (
                <ProfilePage userId={currentUser?._id} />
              ) : (
                <Home />
              )
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/filter/:id" element={<CardDetails />} />
        </Routes>

        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default App;
