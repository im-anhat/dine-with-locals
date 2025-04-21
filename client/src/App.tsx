import React from 'react';
import { UserProvider } from './contexts/UserContext';
import ProfilePage from './pages/ProfilePage';
import './styles/index.css';

//The type React.FC is a type definition for type checking for functional components
//and ensures that children are implicitly typed
const App: React.FC = () => {
  return (
    <UserProvider>
      <div className="min-h-screen flex">
        {/* Left Sidebar - Placeholder for the navigation bar that will be implemented by c Tam */}
        <div className="w-64 bg-brand-purple/10 border-r border-brand-purple/20 flex flex-col">
          <div className="p-6 border-b border-brand-purple/20">
            <h1 className="text-2xl font-bold text-brand-purple">DwL Logo</h1>
          </div>
          <nav className="flex-1 p-4">
            <div className="mb-4 opacity-50">
              <p className="text-sm text-gray-500 mb-2">Navigation area</p>
              <p className="text-xs text-gray-500">
                (Being implemented by teammate)
              </p>
            </div>
            <div className="space-y-2">
              <div className="py-2 px-3 rounded-md bg-brand-purple/20 text-brand-purple font-medium">
                Profile
              </div>
              <div className="py-2 px-3 text-gray-600">Dashboard</div>
              <div className="py-2 px-3 text-gray-600">Feed</div>
              <div className="py-2 px-3 text-gray-600">Chats</div>
              <div className="py-2 px-3 text-gray-600">Places</div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <ProfilePage />
          <div>hello</div>
        </div>
      </div>
    </UserProvider>
  );
};

export default App;
