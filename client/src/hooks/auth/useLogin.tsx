import { useState } from 'react';
import axios from 'axios';
import { UserLogin } from '../../../../shared/types/User';
import { useAuthContext } from './useAuthContext';
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthContext();

  const handleLogin = async (user: UserLogin) => {
    setIsLoading(true);
    setError(null);
    try {
      //ADD API END POINT
      const result = await axios.post('', {
        user,
      });
      //result should return this type LocalStorageUser
      console.log('Success:', result.data);
      // Update the auth context
      login(result.data); //login = (user: AuthenticatedUser)
      // Save the user to local storage
      localStorage.setItem('token', result.data.token);

      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data.message || err.message);
      setIsLoading(false);
      console.log('Error:', err.response?.data || err.message);
    }
  };
  return { handleLogin, isLoading, error };
};
