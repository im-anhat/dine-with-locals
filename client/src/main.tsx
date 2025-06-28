import { createRoot } from 'react-dom/client';
import React from 'react';
import './styles/index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { UserProvider } from './contexts/UserContext.tsx';
import { SocketProvider } from './contexts/SocketContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const client_id =
  import.meta.env.GOOGLE_AUTH_CLIENT_ID ||
  '885466674364-abd45qvt9dc5du9vqj5ecbau78s06ppf.apps.googleusercontent.com';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={client_id}>
        <AuthProvider>
          <UserProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </UserProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
