import React from 'react';
import { AuthProvider } from './contexts/ExampleAuthContext';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/ExampleHome';
import './styles/main.css';
import SignUpPage from './pages/auth/SignUpPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Home />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
