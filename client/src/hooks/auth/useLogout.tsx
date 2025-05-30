import { useAuthContext } from './useAuthContext';
export const useLogout = () => {
  //When loggin out, we don't need to send the request to the backend
  //We just need to (1) remove the user from local storage and (2) update the auth context
  const { logout } = useAuthContext();
  const userLogout = () => {
    //remove user from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    //dispatch logout action, update the context to be null
    logout();
  };

  return { userLogout };
};
