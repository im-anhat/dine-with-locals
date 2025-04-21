import React from 'react';
import { useUserContext } from '../../hooks/useUserContext';

function SubmitSignup() {
  const { user, setUser } = useUserContext();
  const handleSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  return (
    <div>
      <button onClick={handleSignup}>Submit</button>
    </div>
  );
}

export default SubmitSignup;
