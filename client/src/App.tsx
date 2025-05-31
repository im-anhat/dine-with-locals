import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/auth/useAuthContext';
// import { AuthProvider } from './contexts/AuthContext';
// import { UserProvider } from './contexts/UserContext';
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

//The type React.FC is a type definition for type checking for functional components
//and ensures that children are implicitly typed
const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

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
