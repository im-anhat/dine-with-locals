import { useState } from 'react';
import axios from 'axios';
import { User } from '../../../shared/types/User';

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const signup = async (user: User) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('', user); //API endpoint here
      console.log('Signup successful:', response.data);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
