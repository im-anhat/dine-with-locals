import { useState } from 'react';
import axios from 'axios';
import { UserLogin } from '../../../../shared/types/User';
import { useAuthContext } from './useAuthContext';
// import BASE_URL from '../../../../shared/constants/constants';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();

  const handleLogin = async (user: UserLogin) => {
    setIsLoading(true);
    setError(null);
    try {
      /**
       * Backend will return json object has 2 fields: token and user
       * res.status(200).json({ token: token, user: user });
       */
      const result = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/auth/login`,
        user,
      );
      
      const { token, userData } = result.data;
      // Save the user to local storage
      // Save the token and user data to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      // Update the auth context
      login(userData); //login = (user: AuthenticatedUser)
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data.message || err.message);
      setIsLoading(false);
      console.log('Error:', err.response?.data || err.message);
    }
  };
  return { handleLogin, isLoading, error };
};
