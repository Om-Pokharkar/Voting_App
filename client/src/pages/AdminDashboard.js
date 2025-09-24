import React from 'react';
import './AdminPages.css'; // We'll keep the CSS for consistent background and container styles

function AdminDashboard() {
  return (
    <div className="admin-page-container">
      <h2>Welcome, Admin!</h2>
      <p>Select an option from the navigation bar to manage your elections.</p>
    </div>
  );
}

export default AdminDashboard;