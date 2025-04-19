import React from 'react';
import { createContext, useContext, useState } from 'react';
// import { StepContext } from '../contexts/StepContext';
// import { StepContextType } from '../contexts/StepContext';
import { UserContextType } from '../contexts/UserContext';
import { UserContext } from '../contexts/UserContext';

// Custom hook to use the StepContext
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  //Check if the context is undefined, which means the hook is being used outside of a StepProvider
  if (!context) {
    throw new Error('useUserContext must be used within a User');
  }
  return context;
};
