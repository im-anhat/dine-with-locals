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
    <div>
      <h1 className="text-3xl font-bold mb-8">Choose Your Role</h1>
      <div className="flex flex-row items-center justify-center min-h-screen bg-gray-100 gap-6">
        <button
          onClick={() => {
            setInfo('Host');
          }}
          className="w-80 py-6 bg-blue-500 text-white text-xl rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Host
        </button>
        <button
          onClick={() => {
            setInfo('Guest');
          }}
          className="w-80 py-6 bg-blue-500 text-white text-xl rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Guest
        </button>
        <button
          onClick={() => {
            setInfo('Both');
          }}
          className="w-80 py-6 bg-blue-500 text-white text-xl rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Both
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;
