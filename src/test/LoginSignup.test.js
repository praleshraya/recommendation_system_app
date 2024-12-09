import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginSignUp from '../LoginSignUp';

describe('LoginSignUp Component', () => {
  const handleLogin = jest.fn();
  const handleSignup = jest.fn();
  const setIsLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Login form when isLogin is true', () => {
    render(
      <LoginSignUp
        isLogin={true}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        setIsLogin={setIsLogin}
      />
    );

    // Check if Login header is rendered
    expect(screen.getByText('Login')).toBeInTheDocument();

    // Name field should not be rendered
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();

    // Email and Password fields should be rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders Signup form when isLogin is false', () => {
    render(
      <LoginSignUp
        isLogin={false}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        setIsLogin={setIsLogin}
      />
    );

    // Check if Sign Up header is rendered
    expect(screen.getByText('Sign Up')).toBeInTheDocument();

    // Name field should be rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    // Email and Password fields should be rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('calls handleLogin when Login form is submitted', () => {
    render(
      <LoginSignUp
        isLogin={true}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        setIsLogin={setIsLogin}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if handleLogin was called with the correct data
    expect(handleLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      name: '',
    });
  });

  it('calls handleSignup when Signup form is submitted', () => {
    render(
      <LoginSignUp
        isLogin={false}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        setIsLogin={setIsLogin}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check if handleSignup was called with the correct data
    expect(handleSignup).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
  });

  it('calls setIsLogin when switching from Login to Signup', () => {
    render(
      <LoginSignUp
        isLogin={true}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        setIsLogin={setIsLogin}
      />
    );

    // Click the "Register Here" link
    fireEvent.click(screen.getByText(/register here/i));

    // Check if setIsLogin was called with false
    expect(setIsLogin).toHaveBeenCalledWith(false);
  });

  it('updates input fields correctly', () => {
    render(
      <LoginSignUp
        isLogin={false}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        setIsLogin={setIsLogin}
      />
    );

    // Update Name field
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    expect(nameInput.value).toBe('Test User');

    // Update Email field
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    // Update Password field
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });
});
