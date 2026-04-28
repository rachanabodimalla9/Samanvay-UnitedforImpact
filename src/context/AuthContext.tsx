import React, { createContext, useContext, useState, useEffect } from 'react';

type UserType = 'resident' | 'corporate' | 'ngo' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);

  // Check session storage on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('isLoggedIn');
    const savedType = sessionStorage.getItem('userType') as UserType;
    if (savedAuth === 'true' && savedType) {
      setIsAuthenticated(true);
      setUserType(savedType);
    }
  }, []);

  const login = (type: UserType) => {
    setIsAuthenticated(true);
    setUserType(type);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userType', type || '');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
