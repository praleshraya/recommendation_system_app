import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [otpEmail, setOtpEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserDetails(token);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setCurrentUser(userData);
        setIsAdmin(userData.role === 'admin');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setIsAuthenticated(false);
    }
  };

  const login = (user) => {
    setIsAuthenticated(true);
    setIsAdmin(user.role === 'admin');
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setCurrentUser({});
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        currentUser,
        otpEmail,
        setOtpEmail,
        setIsAuthenticated,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
