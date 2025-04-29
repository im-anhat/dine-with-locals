import React from 'react';
import { AuthProvider } from './contexts/ExampleAuthContext';
import { BrowserRouter as Routes, Route } from 'react-router-dom';
import Home from './pages/ExampleHome';
import './styles/main.css';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"


const App: React.FC = () => {
  return (
      <SidebarProvider>
        <AuthProvider>
          <AppSidebar />
          <SidebarTrigger />
          <Routes>
            {/* to-be-replaced with future pages from src/pages */}
              <Route path="/" element={<Home />} />
            </Routes>
        </AuthProvider>
      </SidebarProvider>
  );
};

export default App;
