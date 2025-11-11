import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRole, isLoggedIn } from '../utils/jwtUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: null,
    role: null
  });

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isLoggedIn();
      const role = getUserRole();
      setUser({ isAuthenticated: authenticated, role });
    };

    checkAuth();
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = (token) => {
    localStorage.setItem('jwtToken', token);
    const role = getUserRole();
    setUser({ isAuthenticated: true, role });
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    setUser({ isAuthenticated: false, role: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};