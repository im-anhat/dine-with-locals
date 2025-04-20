import React from 'react';
import ProcessBar from './ProcessBar';
import { useUserContext } from '../../hooks/useUserContext';

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
      <button
        onClick={() => {
          setInfo('Host');
        }}
      >
        Host
      </button>
      <button
        onClick={() => {
          setInfo('Guest');
        }}
      >
        Guest
      </button>
      <button
        onClick={() => {
          setInfo('Both');
        }}
      >
        Both
      </button>
    </div>
  );
}

export default RoleSelection;
