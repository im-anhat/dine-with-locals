import React from 'react';
import Button from '../ExampleButton';

//This component is used to display the process bar in the signup page.
//It will display the current step and the total number of steps.
function ProcessBar({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  const increaseStep = () => {};
  const decreaseStep = () => {};

  return (
    <div>
      <button onClick={increaseStep}>Back</button>
      <button onClick={decreaseStep}>Next</button>
      <div>
        {step} of {totalSteps}
      </div>
    </div>
  );
}

export default ProcessBar;
