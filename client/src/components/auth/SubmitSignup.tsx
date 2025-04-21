import React from 'react';
import { useUserContext } from '../../hooks/auth/useUserContext';
import { useSignUp } from '../../hooks/auth/useSignup';

function SubmitSignup() {
  const { user, setUser } = useUserContext();
  const { signup, isLoading, error } = useSignUp();
  const handleSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signup(user);
  };
  return (
    <div>
      <button onClick={handleSignup}>Submit</button>
    </div>
  );
}

export default SubmitSignup;
