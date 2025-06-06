import { useStep } from '../../hooks/auth/useStep';
import { IoMdArrowRoundBack } from 'react-icons/io';

//This component is used to display the process bar in the signup page.
//It will display the current step and the total number of steps.
function ProcessBar() {
  const { goBack } = useStep();

  return (
    <div className=" absolute top-5 left-10">
      <button
        onClick={() => goBack()}
        className="px-4 py-2 rounded-full hover:bg-gray-100 transition"
      >
        <IoMdArrowRoundBack />
      </button>
    </div>
  );
}

export default ProcessBar;
