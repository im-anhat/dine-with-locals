import { useContext } from 'react';
import AuthContext from '../contexts/ExampleAuthContext';

const useAuthHook = () => {
  // ...existing code: additional hook logic if needed...
  return useContext(AuthContext);
};

export default useAuthHook;
