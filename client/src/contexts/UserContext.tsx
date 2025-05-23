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
// import { getUserById } from '../services/UserService';
// import { jwtDecode } from 'jwt-decode';

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
  // Mock user data from the database for development
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>({
    _id: '67f7f8281260844f9625ee33',
    userName: 'bsi-quy',
    firstName: 'Quy',
    lastName: 'Nguyen',
    phone: '7201234567',
    locationId: '23342342324453',
    cover:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
    avatar:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
    socialLink: 'https://www.linkedin.com/in/quy-duong-nguyen/',
    role: 'Guest',
    hobbies: ['Cooking', 'Traveling', 'Science', 'Politics'],
    ethnicity: 'Asian',
    bio: 'I am a software engineer.',
  });
  const { login } = useAuthContext();
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    const fetchUserData = async () => {
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const userId = decoded._id;
          login();
          const returnUser: AuthenticatedUser = await getUserById(userId);
          setCurrentUser(returnUser);
          const decodedToken: { _id: string } = jwtDecode(token);
          const fetchUserData = async () => {
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
    };
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
