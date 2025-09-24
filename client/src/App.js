// In client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ResultsPage from './pages/ResultsPage';

// Import Layouts
import StudentLayout from './pages/StudentLayout';
import AdminLayout from './pages/AdminLayout';

// Import Pages
import DashboardPage from './pages/DashboardPage';
import VotingPage from './pages/VotingPage';
import AdminDashboard from './pages/AdminDashboard';
import ViewElectionsPage from './pages/ViewElectionsPage';
import ManageElectionPage from './pages/ManageElectionPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* Protected Student Routes (Nested under StudentLayout) */}
        <Route 
          path="/" 
          element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="election/:id" element={<VotingPage />} />
          <Route path="results" element={<ResultsPage />} />
        </Route>

        {/* Protected Admin Routes (Nested under AdminLayout) */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="elections" element={<ViewElectionsPage />} />
          <Route path="election/:id/manage" element={<ManageElectionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;