// In client/src/components/StudentNavbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './StudentNavbar.css';

function StudentNavbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to student login
  };

  return (
    <nav className="student-navbar">
      <div className="student-nav-logo">
        <h3>Student Portal</h3>
      </div>
      <div className="student-nav-links">
        <NavLink to="/dashboard">Elections</NavLink>
        <NavLink to="/results">View Results</NavLink>
      </div>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </nav>
  );
}

export default StudentNavbar;