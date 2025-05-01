import { useState } from 'react';

import ProcessBar from '../../components/auth/ProcessBar';
import { StepProvider } from '../../contexts/StepContext';
import { UserProvider } from '../../contexts/UserContext';
import UserInput from './UserInput';

export const SignUpPage = () => {
  /**
   * Goes to the following step (out of 5) of the signup process.
   * Step 1: Define role (Host, Guest, Both)
   * Step 2: Collect user's personal details: first and last name, ethnicity, hobbies, phone number and social link, username and password
   * Step 3: Submit the form
   */

  return (
    <StepProvider totalSteps={3}>
      <UserProvider>
        <div className="p-20 mt-20">
          <div>
            <UserInput />
            <ProcessBar />
          </div>
        </div>
      </UserProvider>
    </StepProvider>
  );
};
export default SignUpPage;
