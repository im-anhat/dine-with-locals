import React from 'react';
import { User } from '../../../../shared/types/User';
import ProcessBar from './ProcessBar';

interface RoleSelectionProps {
  role: 'Host' | 'Guest' | 'Both';
  setUserData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  incrementStep: (forward: boolean) => void;
}

function RoleSelection({
  role,
  setUserData,
  incrementStep,
}: RoleSelectionProps) {
  return (
    <div>
      <div>
        <h1>What is your role?</h1>
        <div>
          <button onClick={setUserData()}>Host</button>
          <button>Guest</button>
          <button>Both</button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
