import { useState } from 'react';
import axios from 'axios';
import { UserLogin } from '../../../../shared/types/User';
import { useAuthContext } from './useAuthContext';
import { jwtDecode } from 'jwt-decode';
import { getUserById } from '../../services/UserService';
import { useUserContext } from '../useUserContext';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const { setCurrentUser } = useUserContext();
  // const { currentUser, setCurrentUser } = useUserContext();

  const handleLogin = async (user: UserLogin) => {
    setIsLoading(true);
    setError(null);
    try {
      /**
       * Backend will return json object has 1 field: token
       * res.status(200).json({ token: token});
       */
      const result = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/auth/login`,
        user,
      );
      const { token } = result.data;
      // Save token encrypted with _id and user name.
      localStorage.setItem('token', token);
      //Update AuthContext
      login();

      //Update UserContext
      const decodedToken: { _id: string } = jwtDecode(token);
      const fetchUserData = async () => {
        try {
          const user = await getUserById(decodedToken._id);
          setCurrentUser(user);
        } catch (err) {
          console.error('Failed to fetch user data:', error);
        }
      };
      fetchUserData();
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data.message || err.message);
      setIsLoading(false);
      console.log('Error:', err.response?.data || err.message);
    }
  };
  return { handleLogin, isLoading, error };
};
