import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  const login = (token, userInfo) => {
    console.log('Logging in with token:', token); // Debug log
    setAuthState({ token, userInfo });
    console.log('Auth state after login:', { token, userInfo }); // Debug log
  };

  const logout = () => {
    console.log('Logging out'); // Debug log
    setAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
