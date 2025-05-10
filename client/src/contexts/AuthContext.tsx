import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthenticatedUser } from '../../../shared/types/User';
import { getUserById } from '../services/UserService';
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
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  // token: string;
  login: (user: AuthenticatedUser) => void;
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
type AuthAction =
  | { type: 'LOGIN'; payload: AuthenticatedUser }
  | { type: 'LOGOUT' };

/**
 * This interface defines the structure of the authentication state.
 * @param user The authenticated user's data, or null if no user is logged in.
 */
interface AuthState {
  user: AuthenticatedUser | null;
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
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
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
    const token = localStorage.getItem('token');

    //=====================PARSE _id from token==========================//
    if (token) {
      try {
        const decodedToken: { _id: string } = jwtDecode(token);
        const userId = decodedToken._id;

        const fetchUserData = async () => {
          try {
            if (userId) {
              // If not the current user, fetch the user data
              const userData = await getUserById(userId);
              if (userData) {
                dispatch({ type: 'LOGIN', payload: userData });
              }
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

  const login = (userData: AuthenticatedUser) => {
    // localStorage.setItem('user', JSON.stringify(user));
    console.log('Updating context with user in AuthContext:', userData); // Debug log
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    // localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    //Provide the state and dispatch function to the context so that other components can access it.
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: !!state.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
