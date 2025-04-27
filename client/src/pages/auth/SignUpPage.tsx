import React, { useState } from 'react';
import RoleSelection from '../../components/auth/RoleSelection';
import PersonalInformationInput from '../../components/auth/PersonalInformationInput';
import ContactInfo from '../../components/auth/ContactInfo';
import AuthenticateInput from '../../components/auth/AuthenticateInput';
import SubmitSignup from '../../components/auth/SubmitSignup';
import ProcessBar from '../../components/auth/ProcessBar';
import { useStep } from '../../hooks/auth/useStep';

export const SignUpPage = () => {
  const { currentStep, setCurrentStep, totalSteps } = useStep();
  //isLoading variable to keep track of the loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Partial<User> is used to define a variable empty field at the beginning

  /**
   * Goes to the following step (out of 5) of the signup process.
   * Step 1: Define role (Host, Guest, Both)
   * Step 2: Collect user's personal details: first and last name, ethnicity, hobbies
   * Step 3: Collect user's phone number and social link
   * Step 4: Collect users' username and password
   * Step 5: Submit the form
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
    if (currentStep === 1) {
      return (
        <div>
          <RoleSelection />
          <ProcessBar />
        </div>
      );
    } else if (currentStep === 2) {
      //Input for personal information
      return (
        <div>
          <PersonalInformationInput />
          <ProcessBar />
        </div>
      );
    } else if (currentStep === 3) {
      //Input for phone number and social link
      return (
        <div>
          <ContactInfo />
          <ProcessBar />
        </div>
      );
    } else if (currentStep === 4) {
      //Input for username and password
      return (
        <div>
          <AuthenticateInput />
          <ProcessBar />
        </div>
      );
    } else if (currentStep === 5) {
      // Submit the form
      return (
        <div>
          <SubmitSignup />
          <ProcessBar />
        </div>
      );
    } else {
      // If the current step is not valid, return null or a default component
      return null;
    }
    return null;
  };
  return <div className="p-20 mt-20">{nextStep()}</div>;

  //This function update the state of step.
};
export default SignUpPage;
