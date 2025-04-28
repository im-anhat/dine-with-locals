import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/ExampleHome';
import './styles/main.css';
import SignUpPage from './pages/auth/SignUpPage';
import { StepProvider } from './contexts/StepContext';
import { UserProvider } from './contexts/UserContext';

const App: React.FC = () => {
  return (
    //value={{ currentStep, setCurrentStep, totalSteps }}
    <AuthProvider>
      <StepProvider totalSteps={3}>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </UserProvider>
      </StepProvider>
    </AuthProvider>
  );
};

export default App;
