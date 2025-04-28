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
    <div className="flex justify-end mt-4 mr-10 absolute bottom-10 right-20">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => handleStepChange(step - 1)}
            className="px-4 py-2 bg-brand-orange-200 text-white rounded-full hover:bg-brand-orange-100 transition"
          >
            Back
          </button>
          <button
            onClick={() => handleStepChange(step + 1)}
            className="px-4 py-2 bg-brand-orange-300 text-white rounded-full hover:bg-brand-orange-100 transition"
          >
            Next
          </button>
        </div>

        <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-brand-stone-700 text-center">
          {step} of {totalSteps}
        </div>
      </div>
    </div>
  );
}

export default ProcessBar;
