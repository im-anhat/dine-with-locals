import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../../../shared/types/User';
//This context store authentication-related state: logged in status, user data, access tokens

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

//Create a context so that the state can be shared with other components.
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

//Reducer function to manage the state of the user based on the action
//works similarly with useState but is typically used when you have complex state logic.
//The reducer function that specifies how the state gets updated.
//take the state and action as arguments, and should return the next state. State and action can be of any types
export const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }; //payload: the data associated with the action
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: React.ReactNode;
}

//Provide authentication-related data and login/logout methods for all child componenents
//children: special prop that allows components to pass nested content or components to other components.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  /**
   * useReducer takes two arguments:
   * authReducer: A reducer function that defines how the state should be updated based on different actions.
   * { user: null }: The initial state, where user is set to null, indicating that no user is logged in initially.
   *
   * useReducer returns an array with exactly two values:
   * (1) State and (2) Dispatch
   * state: The current state of the authentication context. Initially, it is { user: null }.
   * dispatch: A function that is used to send actions to the authReducer to update the state.
   */
  //useReducer to manage the authentication state
  const [state, dispatch] = useReducer(authReducer, {
    user: null, // initial state
  });

  //Use effect to keep updating the site based on the local storage, even after reload the web
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  return (
    //Provide the state and dispatch function to the context so that other components can access it.
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
