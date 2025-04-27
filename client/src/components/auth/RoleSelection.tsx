import React from 'react';
import ProcessBar from './ProcessBar';
import { useUserContext } from '../../hooks/auth/useUserContext';

function RoleSelection() {
  type Role = 'Host' | 'Guest' | 'Both';

  const { user, setUser } = useUserContext();
  const setInfo = (choice: Role) => {
    const newUser = { ...user, role: choice };
    console.log('This is new user', newUser);
    setUser(newUser);
  };
  return (
    <div className="p-20 flex flex-col justify-center ">
      <div className="mt-10">
        <h1 className="text-3xl font-bold mb-10 pt-5">Choose Your Role</h1>
        <div className="flex gap-6 justify-start">
          <button
            onClick={() => setInfo('Host')}
            className="w-36 py-4 bg-brand-coral-300 text-white text-xl rounded-lg shadow-md hover:bg-brand-coral-400 transition"
          >
            Host
          </button>
          <button
            onClick={() => setInfo('Guest')}
            className="w-36 py-4 bg-brand-coral-300 text-white text-xl rounded-lg shadow-md hover:bg-brand-coral-400 transition"
          >
            Guest
          </button>
          <button
            onClick={() => setInfo('Both')}
            className="w-36 py-4 bg-brand-coral-300 text-white text-xl rounded-lg shadow-md hover:bg-brand-coral-400 transition"
          >
            Both
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
