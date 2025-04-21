import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export const useAuthContext = () => {
  // ...existing code: additional hook logic if needed...
  const context = useContext(AuthContext);
  if (!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider');
  }
  return context;
};
