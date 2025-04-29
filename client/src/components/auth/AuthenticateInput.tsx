import React, { useState } from 'react';
import ProcessBar from './ProcessBar';
import { useUserContext } from '../../hooks/auth/useUserContext';
import { useSignUp } from '../../hooks/auth/useSignup';

function AuthenticateInput() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const { user, setUser } = useUserContext();
  const { signup, isLoading, error } = useSignUp();

  const validateInput = () => {
    //Will implement more robust username and password checking in the future.
    if (!user && !password && !checkPassword && password === checkPassword) {
      return true;
    }
    return false;
  };
  const handleSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signup(user);
  };

  const setInfo = () => {
    if (validateInput()) {
      const newUser = { ...user, userName: username, password: password };
      setUser(newUser);
    }
  };
  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col max-w-xl gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Username and Password
          </h1>
        </div>

        <div>
          <label htmlFor="username" className="block text-gray-500 text-sm">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-500 text-sm">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>
        <div>
          <label
            htmlFor="checkPassword"
            className="block text-gray-500 text-sm"
          >
            Re-enter password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={checkPassword}
            onChange={(e) => {
              setCheckPassword(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>

        <button
          onClick={(e) => {
            setInfo();
            handleSignup(e);
          }}
          className="flex justify-center px-4 py-2 mt-2 rounded-full text-white bg-brand-coral-300 border-brand-coral-500 hover:bg-brand-coral-400"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AuthenticateInput;
