import { createRoot } from 'react-dom/client';
import React from 'react';
import './styles/index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { UserProvider } from './contexts/UserContext.tsx';
import { SocketProvider } from './contexts/SocketContext.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
