import React from 'react';
import { AuthProvider } from './contexts/ExampleAuthContext';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/ExampleHome';
import './styles/main.css';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"


const App: React.FC = () => {
  return (
    // moved BrowserRouter from main.tsx to here
    <BrowserRouter> 
      <SidebarProvider>
        <UserProvider>
          <AuthProvider>
            <AppSidebar />
            <SidebarTrigger />
            <Routes>
              {/* to-be-replaced with future pages from src/pages and paths (in AppSidebar) */}
              <Route path="/" element={<Home />} />
            </Routes>
          </AuthProvider>
        </UserProvider>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;
