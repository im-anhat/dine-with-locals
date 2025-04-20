import React, { createContext, ReactNode, useEffect } from 'react';
import { User } from '../../../shared/types/User';

export interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}
export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

//This UserProviderProps interface ensures that the UserProvider component receives valid children.
interface UserProviderProps {
  //children: In React, children refers to any content that is passed between the opening and closing tags of a component
  children: ReactNode; //ReactNode is a flexible type that can represent any content that React can render.
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const initialUser: User = {
    _id: '',
    userName: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatar: '',
    socialLink: '',
    role: 'Host',
    hobbies: [],
    ethnicity: 'Asian',
    password: '',
    bio: '',
  };
  const [user, setUser] = React.useState<User>(initialUser);
  useEffect(() => {
    console.log(user);
  }, [user]);
  //Everytime user changes --> print out user

  //Use reducer --> manage state better --> dispatch actions to update the state
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
