import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  // const { logout } = useAuthContext();
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-row gap-4 justify-end m-4">
        <button onClick={() => {navigate("/login")}} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 shadow-md">Login</button>
        <button onClick={() => {navigate("/signup")}} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 shadow-md">Sign up</button>
      </div>

      <h1>This is Home Page</h1>

    </div>
  
  );
}
