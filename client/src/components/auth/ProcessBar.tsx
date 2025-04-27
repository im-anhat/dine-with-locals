import { useStep } from '../../hooks/auth/useStep';
//This component is used to display the process bar in the signup page.
//It will display the current step and the total number of steps.
function ProcessBar() {
  const { currentStep: step, setCurrentStep, totalSteps } = useStep();

  const handleStepChange = (newStep: number) => {
    if (newStep < 1 || newStep > totalSteps) {
      return;
    } else {
      setCurrentStep(newStep);
    }
  };
  return (
    <div>
      <button onClick={() => handleStepChange(step - 1)}>Back</button>
      <button onClick={() => handleStepChange(step + 1)}>Next</button>
      <div>
        {step} of {totalSteps}
      </div>
    </div>
  );
}

export default ProcessBar;
