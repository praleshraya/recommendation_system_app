import React, { useState } from 'react';
import './LoginSignUp.css';

const LoginSignUp = ({ isLogin, handleLogin, handleSignup, setIsLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(formData);
    } else {
      handleSignup(formData);
    }
  };

  return (
    <div className="login-signup-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required={!isLogin}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      {/* Add a clickable text for switching to signup */}
      {isLogin && (
        <div className="toggle-link">
          <p>
            New User?{' '}
            <span onClick={() => setIsLogin(false)} className="register-link">
              Register Here
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginSignUp;
