import React from 'react';
import { AuthProvider } from './contexts/ExampleAuthContext';
import Home from './pages/ExampleHome';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
};

export default App;
