import { createRoot } from 'react-dom/client';
import React from 'react';
import './styles/index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
