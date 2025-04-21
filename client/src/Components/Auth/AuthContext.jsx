import React, { useCallback, useState } from 'react';

export const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const loginHandler = useCallback((token) => {
    setToken(token);
    localStorage.setItem('token', token);
  });
  const logoutHandler = () => {
    setToken('');
    localStorage.removeItem('token');
  };
  const contextValue = {
    token,
    isLoggedIn: !!token,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
