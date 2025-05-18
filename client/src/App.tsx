import React from 'react';
import './styles/main.css';
import { Routes, Route } from 'react-router-dom';

import Places from './pages/Places';
import { UserProvider } from './contexts/UserContext';

//The type React.FC is a type definition for type checking for functional components
//and ensures that children are implicitly typed
const App: React.FC = () => {
  return (
    <UserProvider>
      <div>
        <Routes>
          <Route path="/" element={<Places />} />
        </Routes>
      </div>
    </UserProvider>
  );
};

export default App;
