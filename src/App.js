import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/AuthContext';
import OTPVerification from './components/OTPVerification';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/dashboard/user" element={<ProtectedRoute component={UserDashboard} role='user' />} />
          <Route path="/dashboard/admin" element={<ProtectedRoute component={AdminDashboard} role='admin'/>} /> */
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ component: Component, role }) => {
  const { isAuthenticated, currentUser } = React.useContext(AuthContext);
  // return isAuthenticated ? <Component /> : <Navigate to="/auth" />;

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" />;
  }

  if (role && currentUser?.role !== role) {
    console.log(`Unauthorized role (${currentUser?.role}), redirecting to correct dashboard`);
    return <Navigate to={currentUser?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'} />;
  }

  console.log('Access granted to component:', Component.name);
  return <Component />;
};

export default App;
