import React from 'react';
import { useLogout } from '../hooks/auth/useLogout';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/auth/useAuthContext';

function DashboardPage() {
  const { userLogout } = useLogout();
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  console.log('Current user in context:', user); // Debug log
  console.log('Is authenticated:', isAuthenticated); // Debug log
  const logout = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    userLogout();
    navigate('/');
  };
  return (
    <>
      <div>DashboardPage</div>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 shadow-md"
      >
        Logout
      </button>

      <div>
        <h1>User's information</h1>
        {isAuthenticated ? (
          <div>
            <div>First name: {user?.firstName}</div>
            <div>Last name: {user?.lastName}</div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

export default DashboardPage;
