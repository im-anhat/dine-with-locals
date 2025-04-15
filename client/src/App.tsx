import React from 'react';
import Home from './pages/ExampleHome';
import './styles/main.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';

//The type React.FC is a type definition for type checking for functional components
//and ensures that children are implicitly typed
const App: React.FC = () => {
  return (
    <div>
      <Home />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
