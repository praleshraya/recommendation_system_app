import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OTPVerification.css';

import { AuthContext } from './AuthContext';

const OTPVerification = () => {
    const { login, isAuthenticated, currentUser } = useContext(AuthContext); // Access AuthContext for setting authentication
    const location = useLocation();
    const navigate = useNavigate();

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const email = location.state?.email; // Get email from state passed during navigation

    useEffect(() => {
        // Redirect if already logged in
        if (isAuthenticated) {
        if (currentUser.role === 'admin') {
            navigate('/dashboard/admin');
        } else {
            navigate('/dashboard/user');
        }
        }
    }, [isAuthenticated, currentUser, navigate]);

    useEffect(() => {
        if (!email) {
        // Redirect back to login if email is not present
        navigate('/auth');
        }
    }, [email, navigate]);

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError('');
        try {
        const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/verify-otp`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: email,
            otp: Number(otp),
            }),
        });
        console.log(email)
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            login(data.user);

            if (data.user.role === 'admin') {
            navigate('/dashboard/admin');
            } else {
            navigate('/dashboard/user');
            }
        } else {
            const errorData = await response.json();
            setError(`OTP verification failed: ${errorData.detail}`);
        }
        } catch (err) {
        console.error('Error verifying OTP:', err);
        setError('An error occurred. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');
        try {
        const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            alert('A new OTP has been sent to your email.');
        } else {
            const errorData = await response.json();
            setError(`Failed to resend OTP: ${errorData.detail}`);
        }
        } catch (err) {
        console.error('Error resending OTP:', err);
        setError('An error occurred. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="otp-verification-container">
        <h2>OTP Verification</h2>
        <p>Please enter the OTP sent to your email: {email}</p>
        <div className="form-group">
            <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button onClick={handleVerifyOTP} className="submit-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <div className="resend-link">
            <p>
            Didn't receive the OTP?{' '}
            <span onClick={handleResendOTP} className="resend-otp-link">
                Resend OTP
            </span>
            </p>
        </div>
        </div>
  );
};

export default OTPVerification;
