import { useState } from 'react';
import ProcessBar from '../../components/auth/ProcessBar';
import { StepProvider } from '../../contexts/StepContext';
import UserInput from './UserInput';

export const SignUpPage = () => {
  /**
   * Goes to the following step (out of 5) of the signup process.
   * Step 1: Define role (Host, Guest, Both)
   * Step 2: Collect user's personal details: first and last name, address, phone number , username and password
   * Step 3: Submit the form
   */

  return (
    <StepProvider totalSteps={3}>
      <div className="p-20 mt-20">
        <div>
          <UserInput />
          <ProcessBar />
        </div>
      </div>
    </StepProvider>
  );
};
export default SignUpPage;
