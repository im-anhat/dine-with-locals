import { useState } from 'react';

import ProcessBar from '../../components/auth/ProcessBar';
import { useStep } from '../../hooks/auth/useStep';
import { StepProvider } from '../../contexts/StepContext';
import UserInput from './UserInput';
import { User } from '../../../../shared/types/User';

type AuthenticatedUser = Omit<User, 'password'>;
type UserLogin = Pick<User, 'userName' | 'password'>;

export const SignUpPage = () => {
  //isLoading variable to keep track of the loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Partial<User> is used to define a variable empty field at the beginning

  /**
   * Goes to the following step (out of 5) of the signup process.
   * Step 1: Define role (Host, Guest, Both)
   * Step 2: Collect user's personal details: first and last name, ethnicity, hobbies, phone number and social link, username and password
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

  //This function update the state of step.
};
export default SignUpPage;
