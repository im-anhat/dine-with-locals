import React, { createContext, ReactNode } from 'react';
import { User } from '../../../shared/types/User';

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

//This UserProviderProps interface ensures that the UserProvider component receives valid children.
interface UserProviderProps {
  //children: In React, children refers to any content that is passed between the opening and closing tags of a component
  children: ReactNode; //ReactNode is a flexible type that can represent any content that React can render.
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
