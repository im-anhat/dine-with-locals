import React, { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/auth/useLogin';
import { UserLogin } from '../../../../shared/types/User';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';

function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { handleLogin } = useLogin();

  const submitLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const userLogin: UserLogin = {
      userName: userName,
      password: password,
    };
    await handleLogin(userLogin);
    console.log("navigating..");
    console.log(user);
    // navigate('/dashboard', { replace: true });
  };
  // Navigate to dashboard after user is updated in AuthContext
  // The user context in AuthContext is not updating properly
  // Navigate to dashboard is not run
  useEffect(() => {
    console.log("Get to the useEffect inside Login Page");
    if (user) {
      console.log("Navigate to dashboard")
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-row justify-center p-20 mt-10">
      <div className="flex flex-col gap-2 w-1/2">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Login
        </h1>
        <input
          name="userName"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-900"
        />
        <input
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-900"
        />
        <button
          onClick={submitLogin}
          className="flex justify-center px-4 py-2 mt-2 rounded-full text-white bg-brand-coral-300 border-brand-coral-500 hover:bg-brand-coral-400"
        >
          Log in
        </button>
        <div className="text-gray-400">
          Don’t have an account yet?{' '}
          <span
            className="text-brand-coral-300 hover:text-brand-coral-100"
            onClick={() => navigate('/signup', { replace: true })}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
