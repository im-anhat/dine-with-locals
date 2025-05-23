import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useAuthContext } from './hooks/auth/useAuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Home from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import './styles/main.css';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"


//The type React.FC is a type definition for type checking for functional components
//and ensures that children are implicitly typed
const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  return (
    // moved BrowserRouter from main.tsx to here
    <BrowserRouter> 
      <SidebarProvider>
        <AuthProvider>
          <UserProvider>
            <AppSidebar />
            <SidebarTrigger />
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
                element={
                  isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />
                }
              />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;
