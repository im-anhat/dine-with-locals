import React from 'react';
import { createContext, useContext, useState } from 'react';
import { StepContext, StepContextType } from '../../contexts/StepContext';

// Custom hook to use the StepContext
export const useStep = (): StepContextType => {
  const context = useContext(StepContext);
  //Check if the context is undefined, which means the hook is being used outside of a StepProvider
  if (!context) {
    throw new Error('useStep must be used within a StepProvider');
  }
  return context;
};
