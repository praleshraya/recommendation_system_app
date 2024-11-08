import React, { useState, useEffect } from 'react';
import './App.css';
import LoginSignup from './components/LoginSignUp';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

const API_BASE_URL = process.env.REACT_APP_BASE_API_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); // Example of new user state
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between login and signup
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage to set initial authentication state
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      checkAdminStatus(token); // Check if the user is an admin
    }
  }, []);

  const checkAdminStatus = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setIsAdmin(userData.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const handleLogin = async (formData) => {
    // Logic to verify login (e.g., call an API)
    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login (e.g., save token, redirect)
        console.log('Login successful:', data);
        // Save token to localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        setIsAuthenticated(true);
        alert('Login successful!');
      } else {
        // Handle server errors
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert(`Login failed: ${errorData.detail}`);
      }
    } catch (error) {
      // Handle network errors
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };

  const handleSignup = async(formData) => {
    // Logic to create a new user (e.g., call an API)
    console.log('Signup successful:', formData);
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful signup (e.g., display a success message)
        console.log('Signup successful:', data);
        alert('Signup successful!');
        setIsAuthenticated(true);
        setIsNewUser(true); // Assuming newly registered user
      } else {
        // Handle server errors
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
        alert(`Signup failed: ${errorData.detail}`);
      }
    } catch (error) {
      // Handle network errors
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    alert('Logged out successfully');
  };


  return (
    <div className="App">
      {isAuthenticated && isAdmin ? (
  <AdminDashboard />
) : isAuthenticated ? (
        <UserDashboard isNewUser={isNewUser} handleLogout={handleLogout}/>
      ) : (
        <LoginSignup
          isLogin={isLoginView} // Use a state toggle if needed
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          setIsLogin={setIsLoginView}
        />
      )}
    </div>
  );
}

export default App;
