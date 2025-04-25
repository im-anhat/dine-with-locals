import React from 'react';
import { AuthProvider } from './contexts/ExampleAuthContext';
import FeedPage from './pages/FeedPage';
import { Toaster } from './components/ui/toaster';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FeedPage/>
      <Toaster />
    </AuthProvider>
  );
};

export default App;
