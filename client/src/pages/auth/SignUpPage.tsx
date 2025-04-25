import React from 'react';
import { useState } from 'react';
import { User } from '../../../../shared/types/User';
import RoleSelection from '../../components/auth/RoleSelection';
import PersonalInformationInput from '../../components/auth/PersonalInformationInput';
import SocialContactInput from '../../components/auth/SocialContactInput';
import AuthenticateInput from '../../components/auth/AuthenticateInput';

export const SignUpPage = () => {
  const [step, setStep] = useState<number>(1);
  //isLoading variable to keep track of the loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Partial<User> is used to define a variable empty field at the beginning
  const [userData, setUserData] = useState<Partial<User>>({
    role: 'Host',
    ethnicity: 'Asian',
    hobbies: [],
  });
  /**
   * Goes to the following step (out of 5) of the signup process.
   * Step 1: Define role (Host, Guest, Both)
   * Step 2: Collect user's personal details: first and last name, ethnicity, hobbies
   * Step 3: Collect user's phone number and social link
   * Step 4: Collect users' username and password
   * Step 5: Submit
   *
   *
   * In each child componenent, the parent componenent passed in whatever variable needed for sign up.
   * For example, in step 1, the parent will only pass userData.role, setUserData, and setState to the child component.
   * The child component will then update the userData.role when the user select a role. Moreover,
   * it will also update the step state to the next step. And reset the initial values of the field in the user object.
   * The parent component will then pass the updated userData to the next child component.
   *
   */
  const nextStep = () => {
    if (step === 1) {
      // Check if the user has selected a role
      // <RoleSelection
      //   role={userData.role}
      //   setUserData={setUserData}
      //   incrementStep={incrementStep}
      // />;
    } else if (step === 2) {
      // Check if the user has entered a name
      <PersonalInformationInput />;
    } else if (step === 3) {
      // Check if the user has entered a phone number
      <SocialContactInput />;
      // Check if the phone number is valid
    } else if (step === 4) {
      // Check if the user has entered a username and password
      <AuthenticateInput />;
    } else if (step === 5) {
      // Submit the form
      setIsLoading(true);
      // Call the API to create a new user
      // If successful, redirect to the login page
      // If failed, show an error messages
    }

    return <div>Sign Up</div>;
  };

  //This function update the state of step.
  const incrementStep = (forward: boolean): void => {
    setStep((currentStep) => (forward ? currentStep + 1 : currentStep - 1));
  };
};
export default SignUpPage;
