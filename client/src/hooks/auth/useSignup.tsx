import { useState } from 'react';
import axios from 'axios';
import { UserSignUp } from '../../../../shared/types/User';
// import BASE_URL from '../../../../shared/constants/constants';

export const useSignUp = () => {
  // console.log(`${import.meta.env.VITE_API_BASE_URL}}api/auth/signup`);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * This async function use POST request to send user's data and send back to the backend
   * @param user user's data
   */
  const signup = async (user: UserSignUp) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/auth/signup`,
        user,
      );
      console.log('Signup successful:', response.data);
      // Save the user to local storage
      localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(
        err.response?.data?.message || 'error sent back in useSignup can',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
