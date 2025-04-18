import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types for the context
interface StepContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

//<StepContextType | undefined> means the context will either hold a value of type StepContextType or undefined.
//undefined is the default value passed to createContext, to indicate that the context value has not been set yet,
// i.e., it’s undefined when first created.
//Using undefined will help us later catch potential issues when accessing the context.
//If you attempt to access the context without a provider wrapping your component tree,
//useContext(StepContext) will return undefined

const StepContext = createContext<StepContextType | undefined>(undefined);
//createContext is used to create a React context --> Allow you to pass data through the component tree without having to pass props manually at every level.

//StepContext provider component
//props of the StepProvider component
interface StepProviderProps {
  //children: In React, children refers to any content that is passed between the opening and closing tags of a component
  children: ReactNode; //ReactNode is a flexible type that can represent any content that React can render.
  totalSteps: number; // Pass total steps as a prop to the provider
}

//This StepProviderProps interface ensures that the StepProvider component receives valid children.
//It makes the code more type-safe by enforcing that only valid React nodes are passed as children to StepProvider.
//StepProvider component to wrap the application or specific parts of it
export const StepProvider: React.FC<StepProviderProps> = ({
  children,
  totalSteps,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <StepContext.Provider value={{ currentStep, setCurrentStep, totalSteps }}>
      {children}
    </StepContext.Provider>
  );
};

// Custom hook to use the StepContext
export const useStep = (): StepContextType => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStep must be used within a StepProvider');
  }
  return context;
};
