import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import './AdminLoginPage.css';

function AdminLoginPage() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // The backend login endpoint is the same for both users
      const response = await apiClient.post('/auth/login', {
        studentId: adminId, // The backend API expects a 'studentId' key
        password: password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      // We'll redirect to an admin-specific dashboard
      navigate('/admin/dashboard');

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your connection.');
      }
    }
  };

  return (
    <div className="login-page">
      {/* Main White Container */}
      <div className="login-container">
        <div className="login-header">
          <img src="/vit-chennai.png" alt="VIT Chennai" className="logo-left" />
          <h2>Admin Login</h2>
          <img src="/logo.png" alt="App Logo" className="logo-right" />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="adminId">Admin ID</label>
            <input 
              type="text" 
              id="adminId" 
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn">Login</button>
          
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>

      {/* Student Link Container - Positioned Below */}
      <div className="links-container">
        <p>If you are a Student, please login here:</p>
        <Link to="/" className="admin-login-link">Student Login</Link>
      </div>
    </div>
  );
}

export default AdminLoginPage;