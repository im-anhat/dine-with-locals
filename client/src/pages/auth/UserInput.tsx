import React from 'react';
import { useStep } from '../../hooks/auth/useStep';
import RoleSelection from '../../components/auth/RoleSelection';
import AuthenticateInput from '../../components/auth/AuthenticateInput';
import PersonalInformationInput from '../../components/auth/PersonalInformationInput';
function UserInput() {
  const { currentStep: step, setCurrentStep, totalSteps } = useStep();

  //Record as component
  const stepToComponent: Record<number, React.JSX.Element> = {
    1: <RoleSelection />,
    2: <PersonalInformationInput />,
    3: <AuthenticateInput />,
  };
  //? : Will happen if stepToComponent[currentStep] is true
  return <div>{stepToComponent[step] ? stepToComponent[step] : null}</div>;
}

export default UserInput;
