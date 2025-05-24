import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../../../shared/types/User';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
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
  // const [currentUser, setCurrentUser] = useState<User | null>({
  //   // _id: '67f7f8281260844f9625ee32',
  //   // userName: 'im-anhat',
  //   // firstName: 'Nhat',
  //   // lastName: 'Le',
  //   // phone: '5158154578',
  //   // avatar:
  //   //   'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
  //   // socialLink: 'https://www.linkedin.com/in/chris-le05/',
  //   // role: 'Host',
  //   // hobbies: ['Cooking', 'Traveling', 'Science', 'Politics'],
  //   // ethnicity: 'Asian',
  //   // bio: 'I am a software engineer with a passion for artificial intelligence.',
  // });

  const [currentUser, setCurrentUser] = useState<User | null>({
    _id: '67f7f8281260844f9625ee33',
    userName: 'bsi-quy',
    firstName: 'Quy',
    lastName: 'Nguyen',
    phone: '7201234567',
    avatar:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
    socialLink: 'https://www.linkedin.com/in/quy-duong-nguyen/',
    role: 'Guest',
    hobbies: ['Cooking', 'Traveling', 'Science', 'Politics'],
    ethnicity: 'Asian',
    bio: 'I am a software engineer.',
  });

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
