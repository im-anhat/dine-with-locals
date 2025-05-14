import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/auth/useAuthContext';
import Home from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import DashoardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import './styles/main.css';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/signup"
        element={
          !isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />
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
      <Route path="/dashboard" element={<DashoardPage />} />
    </Routes>
  );
};

export default App;
