// In client/src/components/AdminNavbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-logo">
        <h3>Admin Panel</h3>
      </div>
      <div className="admin-nav-links">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/elections">Manage Elections</NavLink>
      </div>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </nav>
  );
}

export default AdminNavbar;