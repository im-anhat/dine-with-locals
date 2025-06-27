import { useState } from 'react';
import axios from 'axios';
import { UserLogin } from '../../../../shared/types/User';
import { useAuthContext } from './useAuthContext';
import { jwtDecode } from 'jwt-decode';
import { getUserById } from '../../services/UserService';
import { useUserContext } from '../useUserContext';
import { AuthenticatedUser } from '../../../../shared/types/User';
// import BASE_URL from '../../../../shared/constants/constants';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const { setCurrentUser } = useUserContext();

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

      // Decrypt token to get _id use post request to send back to server to get the information.
      // Then update the context with the information sent from backend
      //===================MORE CODE HERE=================================//

      const decoded: any = jwtDecode(token);
      const userId = decoded._id;
      login();
      const returnUser: AuthenticatedUser = await getUserById(userId);
      setCurrentUser(returnUser);

      //=================================================================//
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data.message || err.message);
      setIsLoading(false);
      console.log('Error:', err.response?.data || err.message);
    }
  };

  const handleGoogleAuth = async (googleToken: string | undefined) => {
    console.log('Google login response:', googleToken);
    setIsLoading(true);
    setError(null);
    try {
      /**
       * Backend will return json object has 1 field: token
       * res.status(200).json({ token: token});
       */
      const result = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/auth/google`,
        { credential: googleToken },
      );

      const { token } = result.data;
      console.log(token);

      // Save token encrypted with _id and user name.
      localStorage.setItem('token', token);

      // Decrypt token to get _id use post request to send back to server to get the information.
      // Then update the context with the information sent from backend
      //===================MORE CODE HERE=================================//

      const decoded: any = jwtDecode(token);
      const userId = decoded._id;
      login();
      const returnUser: AuthenticatedUser = await getUserById(userId);
      setCurrentUser(returnUser);

      //=================================================================//
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data.message || err.message);
      setIsLoading(false);
      console.log('Error:', err.response?.data || err.message);
    }
  };
  return { handleLogin, handleGoogleAuth, isLoading, error };
};
