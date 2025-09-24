import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // 1. If no token exists, redirect to the student login page.
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    // Check if the token has expired
    const isTokenExpired = decodedToken.exp * 1000 < Date.now();

    if (isTokenExpired) {
      localStorage.removeItem('token');
      // 2. If token is expired, redirect to login.
      return <Navigate to="/" />;
    }

    // 3. If the route is for admins only, check the user's role.
    if (adminOnly && decodedToken.role !== 'admin') {
      // If a non-admin tries to access an admin page, send them to their own dashboard.
      return <Navigate to="/dashboard" />;
    }
    
    // 4. If everything is valid, show the requested page.
    return children;
    
  } catch (error) {
    // If the token is malformed or invalid
    localStorage.removeItem('token');
    return <Navigate to="/" />;
  }
}

export default ProtectedRoute;