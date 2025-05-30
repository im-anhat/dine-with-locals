import { useStep } from '../../hooks/auth/useStep';
import { IoMdArrowRoundBack } from 'react-icons/io';

//This component is used to display the process bar in the signup page.
//It will display the current step and the total number of steps.
function ProcessBar() {
  const { goBack } = useStep();

  return (
    <div className="flex justify-end mt-4 mr-10 absolute top-5 left-10">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => goBack()}
            className="px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <IoMdArrowRoundBack />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProcessBar;
