import React, { useState } from 'react';
import { useSignUp } from '../../hooks/auth/useSignup';
import { useNavigate } from 'react-router-dom';
import { UserSignUp } from '../../../../shared/types/User';

interface LocationInterface {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface AuthenticateInputProp {
  user: UserSignUp;
  location: LocationInterface;
  setUserName: (username: string) => void;
  setPassword: (password: string) => void;
}
function AuthenticateInput({
  user,
  location,
  setUserName,
  setPassword,
}: AuthenticateInputProp) {
  const [checkPassword, setCheckPassword] = useState('');
  const { signup, isLoading, error } = useSignUp();
  const navigate = useNavigate();

  const validateInput = () => {
    //Will implement more robust username and password checking in the future.
    console.log(user);
    if (
      !user.userName ||
      !user.password ||
      !checkPassword ||
      user.password === checkPassword
    ) {
      return true;
    } else {
      //Toaster
      console.log('Passwords do not match or fields are empty');
    }
    return false;
  };

  /**
   * This function use the useSignup hook to send the data from frontend to backend.
   * Async function to handle the signup process, it prevents the default form submission behavior.
   *
   */
  const handleSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateInput()) {
      await signup(user);
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col max-w-1/3 gap-2">
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
            value={user.userName}
            onChange={(e) => {
              setUserName(e.target.value);
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
            value={user.password}
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
            handleSignup(e);
            //Navigate to login page if signup is successful
          }}
          className="flex justify-center px-4 py-2 mt-2 rounded-full text-white bg-brand-coral-300 border-brand-coral-500 hover:bg-brand-coral-400"
        >
          Submit
        </button>
        <div>{error || null}</div>
      </div>
    </div>
  );
}

export default AuthenticateInput;
