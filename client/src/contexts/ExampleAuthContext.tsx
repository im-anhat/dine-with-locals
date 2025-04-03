import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  user: any;
  login: (phone: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Added explicit children prop type using React.ReactNode.
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const login = (phone: string, password: string) => {
    // ...existing code: implement login logic...
    setUser({ phone });
  };

  const logout = () => {
    // ...existing code: implement logout logic...
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
