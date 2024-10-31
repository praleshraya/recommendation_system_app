import React, { useState } from 'react';
import './App.css';
import LoginSignup from './components/LoginSignUp';
import UserDashboard from './components/UserDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); // Example of new user state
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between login and signup


  const handleLogin = async (formData) => {
    // Logic to verify login (e.g., call an API)
    try {
      const response = await fetch('http://localhost:8080/login', {
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
      const response = await fetch('http://localhost:8080/signup', {
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

  return (
    <div className="App">
      {isAuthenticated ? (
        <UserDashboard isNewUser={isNewUser} />
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
