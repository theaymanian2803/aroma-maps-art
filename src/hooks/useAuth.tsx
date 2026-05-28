import { createContext, useContext, useState, ReactNode } from 'react';


interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '011235@Admin';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });


  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Safe fallback (e.g. during HMR before provider remounts)
    return {
      isAuthenticated: false,
      login: () => false,
      logout: () => {},
    };
  }
  return context;
};

  return context;
};
