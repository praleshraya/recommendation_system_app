import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginSignup from './LoginSignup';
import { AuthContext } from './AuthContext';

const Auth = () => {
  const { setOtpEmail, isAuthenticated, currentUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true); // Controls whether to show Login or Signup

  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard if already authenticated
    if (isAuthenticated) {
      setIsLogin(true);
      if (currentUser.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/user');
      }
    }
  },[]);

  const handleLogin = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setOtpEmail(formData.email);
        navigate('/otp', { state: { email: formData.email } }); // Pass email to OTPVerification

      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (formData, setError) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        alert('Signup successful! Please login to continue.');
        setIsLogin(true); // Switch back to login view after successful signup
      } else {
        const errorData = await response.json();
        setError(`Signup failed: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred during signup. Please try again later.');
    }
  };

  return <LoginSignup handleLogin={handleLogin} handleSignup={handleSignup} isLogin={isLogin} setIsLogin= {setIsLogin}/>;
};

export default Auth;
