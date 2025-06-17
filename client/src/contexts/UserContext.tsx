import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { User, AuthenticatedUser } from '../../../shared/types/User';
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from '../hooks/auth/useAuthContext';
import { getUserById } from '../services/UserService';

interface UserContextType {
  currentUser: AuthenticatedUser | null;
  setCurrentUser: (user: AuthenticatedUser | null) => void;
}

const defaultUserContext: UserContextType = {
  currentUser: null,
  setCurrentUser: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(
    null,
  );
  const { login } = useAuthContext();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const fetchUserData = async () => {
          const decoded: any = jwtDecode(token);
          const userId = decoded._id;
          login();
          const returnUser: AuthenticatedUser = await getUserById(userId);
          setCurrentUser(returnUser);
          const decodedToken: { _id: string } = jwtDecode(token);
          try {
            const userData = await getUserById(decodedToken._id);
            setCurrentUser(userData);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        };

        fetchUserData();
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
