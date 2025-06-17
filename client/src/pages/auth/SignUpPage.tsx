import ProcessBar from '../../components/auth/ProcessBar';
import { StepProvider } from '../../contexts/StepContext';
import UserInput from './UserInput';
import { Card, CardContent } from '@/components/ui/card';
export const SignUpPage = () => {
  /**
   * Goes to the following step (out of 5) of the signup process.
   * Step 1: Define role (Host, Guest, Both)
   * Step 2: Collect user's personal details: first and last name, address, phone number , username and password
   * Step 3: Submit the form
   */

  return (
    <StepProvider totalSteps={3}>
      <div className="w-full h-full bg-brand-coral-400 bg-gradient-to-l from-rose-500 to-[#fc6767]">
        <div className="flex justify-center m-20">
          <Card>
            <CardContent className="rounded-xl p-20">
              <UserInput />
            </CardContent>
          </Card>
        </div>
        <ProcessBar />
      </div>
    </StepProvider>
  );
};
export default SignUpPage;
