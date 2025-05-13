import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthenticatedUser } from '../../../shared/types/User';
import { jwtDecode } from 'jwt-decode';

//This context store authentication-related state: logged in status, user data

/**
 * This interface includes 4 components
 * @param user User's data that's already excluded password.
 * @param token the token generated from backend
 * @param isAuthenticated a boolean to check if the user is authenticated or not
 * @param login a function to update the state to LOGIN and this AuthenticatedUser context will be accessed through payload
 * @param logou a function to update the state to LOGOUT and set the payload = NULL
 */
interface AuthContextType {
  isAuthenticated: boolean;
  // token: string;
  login: () => void;
  logout: () => void;
}

//Create a context so that the state can be shared with other components.
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

/**
 * This interface defines the structure of the action object that will be dispatched to the reducer.
 * @param type A string that indicates the type of action being performed. In this case, it can be either 'LOGIN' or 'LOGOUT'.
 * @param payload The data associated with the action. For the 'LOGIN' action, it will be an AuthenticatedUser object. For the 'LOGOUT' action, it is not used.
 */
type AuthAction = { type: 'LOGIN'; payload: boolean } | { type: 'LOGOUT' };

/**
 * This interface defines the structure of the authentication state.
 * @param user The authenticated user's data, or null if no user is logged in.
 */
interface AuthState {
  isAuthenticated: boolean;
}

/**
 * Reducer function to manage the state of the user based on the action.
 * @param state the current state of the authentication context.
 * @param action the action object that contains the type of action and any associated payload.
 * @returns the next state
 */
export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      console.log('Reducer updating state with user:', action.payload); // Log the payload
      return { isAuthenticated: true };
    case 'LOGOUT':
      return { isAuthenticated: false };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

//Provide authentication-related data and login/logout methods for all child componenents
//children: special prop that allows components to pass nested content or components to other components.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  /**
   * useReducer takes two arguments:
   * authReducer: A reducer function that defines how the state should be updated based on different actions.
   * { isAuthenticated: null }: The initial state, where isAuthenticated is set to false, indicating that no user is logged in initially.
   *
   * useReducer returns an array with exactly two values:
   * (1) State and (2) Dispatch
   * state: The current state of the authentication context. Initially, it is { user: null }.
   * dispatch: A function that is used to send actions to the authReducer to update the state.
   */
  //useReducer to manage the authentication state
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false, // initial state
  });

  //Use effect to keep updating the site based on the local storage, even after reload the web
  useEffect(() => {
    const token = localStorage.getItem('token');

    //=====================PARSE _id from token==========================//
    if (token) {
      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const expNum = decodedToken.exp;

        const fetchUserData = async () => {
          try {
            if (expNum * 1000 > Date.now()) {
              // Token is valid, update the context
              dispatch({ type: 'LOGIN', payload: true });
            } else {
              //Token expire, clear  it
              localStorage.removeItem('token');
            }
          } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('token');
          }
        };
        fetchUserData();
      } catch (error) {}
    }
  }, []);

  const login = () => {
    dispatch({ type: 'LOGIN', payload: true });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    //Provide the state and dispatch function to the context so that other components can access it.
    <AuthContext.Provider
      value={{
        isAuthenticated: !!state.isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
