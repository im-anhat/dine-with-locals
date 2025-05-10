import React from 'react';
import ProcessBar from './ProcessBar';
import { useStep } from '../../hooks/auth/useStep';

interface RoleSelectionProps {
  setRole: (role: 'Host' | 'Guest') => void;
}

function RoleSelection({ setRole }: RoleSelectionProps) {
  // type Role = 'Host' | 'Guest';

  // const { user, setUser } = useUserContext();
  const { goNext } = useStep();

  // const setInfo = (choice: Role) => {
  //   const newUser = { ...user, role: choice };
  //   console.log('This is new user', newUser);
  //   setUser(newUser);
  // };
  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col">
        <div className="">
          <h1 className="text-3xl font-bold mb-10 pt-5 text-center">
            Choose Your Role
          </h1>
          <div className="flex gap-6 justify-start">
            <button
              onClick={() => {
                setRole('Host');
                goNext();
              }}
              className="w-36 py-4 bg-brand-coral-300 text-white text-xl rounded-full shadow-md hover:bg-brand-coral-400 transition"
            >
              Host
            </button>
            <button
              onClick={() => {
                setRole('Guest');
                goNext();
              }}
              className="w-36 py-4 bg-brand-coral-300 text-white text-xl rounded-full shadow-md hover:bg-brand-coral-400 transition"
            >
              Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
