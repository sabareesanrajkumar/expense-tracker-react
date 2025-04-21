import React, { useCallback, useState } from 'react';
import axios from 'axios';

export const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  emailVerified: false,
  login: (token) => {},
  logout: () => {},
  sendVerificationEmail: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [emailVerified, setEmailVerified] = useState(false);

  const loginHandler = useCallback((token) => {
    setToken(token);
    checkEmailVerification(token);
    localStorage.setItem('token', token);
  });
  const logoutHandler = () => {
    setToken('');
    setEmailVerified(false);
    localStorage.removeItem('token');
  };

  const checkEmailVerification = (token) => {
    if (token) {
      axios
        .post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
          { idToken: token }
        )
        .then((response) => {
          const user = response.data.users[0];
          setEmailVerified(user.emailVerified);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  };

  const sendVerificationEmail = async () => {
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIREBASE_WEB_API_KEY}`,
        {
          requestType: 'VERIFY_EMAIL',
          idToken: token,
        }
      );
      alert('Sent a verification link.');
    } catch (error) {
      const errorMsg =
        error.response?.data?.error?.message ||
        'Failed to send verification email';
      alert(errorMsg);
    }
  };

  const contextValue = {
    token,
    isLoggedIn: !!token,
    login: loginHandler,
    logout: logoutHandler,
    emailVerified,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
