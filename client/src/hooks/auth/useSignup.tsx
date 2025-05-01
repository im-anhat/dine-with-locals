import { useState } from 'react';
import axios from 'axios';
import { User } from '../../../../shared/types/User';
import BASE_URL from '../../../../shared/constants/constants';

export const useSignUp = () => {
  console.log(`${BASE_URL}api/auth/signup`);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const signup = async (user: User) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}api/auth/signup`, user); //API endpoint here
      console.log('Signup successful:', response.data);
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
