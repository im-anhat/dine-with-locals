import React from 'react';
import { AuthProvider } from './contexts/ExampleAuthContext';
import { UserProvider } from './contexts/UserContext';
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router'
import Home from './pages/ExampleHome';
import CreateListing from './pages/CreateListing';
import './styles/main.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/AppSidebar';
import { TopNavbar } from '@/components/TopNavbar';

const App: React.FC = () => {
  // useLocation for dynamic path in the TopNavbar
  const location = useLocation();
  const currentPath = location.pathname.split('/').filter(Boolean);
  if (currentPath.length === 0) {
    currentPath.push("Dashboard");
  }
  console.log('Current path:', currentPath);

  return (
    <SidebarProvider>
      <UserProvider>
        <AuthProvider>
          <div className="flex w-full">
            <AppSidebar />
            <main className="flex flex-1 flex-col">
              <TopNavbar currentPath={currentPath} />
              <Separator />
              <Routes>
                {/* to-be-replaced with future pages from src/pages and paths (in AppSidebar) */}
                <Route path="/" element={<Home />} />
                <Route path="/host/create-listing" element={<CreateListing />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </UserProvider>
    </SidebarProvider>
  );
};

export default App;
