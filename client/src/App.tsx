import React from 'react';
import { UserProvider } from './contexts/UserContext';
import ProfilePage from './pages/ProfilePage';
import './styles/index.css';

//The type React.FC is a type definition for type checking for functional components
//and ensures that children are implicitly typed
const App: React.FC = () => {
  const userIdToView = '67f7f8281260844f9625ee33'; // Example: '67f7f8281260844f9625ee33'

  return (
    <UserProvider>
      <div className="min-h-screen flex bg-brand-shell-100">
        {/* Left Sidebar - Placeholder for the navigation bar */}
        <div className="w-64 bg-white border-r border-brand-stone-200 flex flex-col shadow-sm">
          <div className="p-6 border-b border-brand-stone-200 bg-gradient-to-r from-brand-coral-500 to-brand-teal-400">
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">
              DwL Logo
            </h1>
          </div>
          <nav className="flex-1 p-4">
            <div className="mb-4 opacity-50">
              <p className="text-sm text-brand-stone-500 mb-2">
                Navigation area
              </p>
              <p className="text-xs text-brand-stone-400">
                (Being implemented by teammate)
              </p>
            </div>
            <div className="space-y-2">
              <div className="py-2 px-4 rounded-md bg-brand-coral-100 text-brand-coral-700 font-medium border-l-4 border-brand-coral-500 shadow-sm">
                Profile
              </div>
              <div className="py-2 px-4 text-brand-stone-600 hover:bg-brand-shell-100 rounded-md transition-colors hover:text-brand-coral-600">
                Dashboard
              </div>
              <div className="py-2 px-4 text-brand-stone-600 hover:bg-brand-shell-100 rounded-md transition-colors hover:text-brand-coral-600">
                Feed
              </div>
              <div className="py-2 px-4 text-brand-stone-600 hover:bg-brand-shell-100 rounded-md transition-colors hover:text-brand-coral-600">
                Chats
              </div>
              <div className="py-2 px-4 text-brand-stone-600 hover:bg-brand-shell-100 rounded-md transition-colors hover:text-brand-coral-600">
                Places
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <ProfilePage userId={userIdToView} />
        </div>
      </div>
    </UserProvider>
  );
};

export default App;
