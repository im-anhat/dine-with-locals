import { useState } from 'react';

import ProcessBar from '../../components/auth/ProcessBar';
import { useStep } from '../../hooks/auth/useStep';
import UserInput from './UserInput';

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
    <div className="p-20 mt-20">
      <div>
        <UserInput />
        <ProcessBar />
        {/* Replace this with only back button */}
      </div>
    </div>
  );

  //This function update the state of step.
};
export default SignUpPage;
