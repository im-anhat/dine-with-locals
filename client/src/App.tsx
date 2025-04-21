import React from 'react';
import { AuthProvider } from './contexts/ExampleAuthContext';
import FeedPage from './pages/FeedPage';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FeedPage />
    </AuthProvider>
  );
};

export default App;
