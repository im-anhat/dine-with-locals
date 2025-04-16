import React from 'react';
import { useUser } from '../contexts/UserContext';

const Header: React.FC = () => {
  const { currentUser } = useUser();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">Dine with Locals</h1>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition"
              >
                Home
              </a>
              <a href="#" className="text-primary transition">
                Profile
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition"
              >
                Listings
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition"
              >
                Requests
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition"
              >
                Social
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="text-sm hidden md:block">
                <p className="text-gray-800 font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-gray-500 text-xs">{currentUser.role}</p>
              </div>
              <div className="relative group">
                <img
                  src={currentUser.avatar}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow cursor-pointer"
                />
                <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 mt-1 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 transform origin-top-right">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
