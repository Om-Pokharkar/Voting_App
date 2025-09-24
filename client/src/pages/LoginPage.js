import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import './LoginPage.css';

function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await apiClient.post('/auth/login', {
        studentId: studentId,
        password: password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');

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
          <h2>Student Login</h2>
          <img src="/logo.png" alt="App Logo" className="logo-right" />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input 
              type="text" 
              id="studentId" 
              name="studentId" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn">Login</button>
          
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>

      {/* Admin Link Container - Positioned Below */}
      <div className="links-container">
        <p>If you are an Admin, please login here:</p>
        <Link to="/admin" className="admin-login-link">Admin Login</Link>
      </div>
    </div>
  );
}

export default LoginPage;