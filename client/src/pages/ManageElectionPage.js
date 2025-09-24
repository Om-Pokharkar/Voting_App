import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import './AdminPages.css';

function ManageElectionPage() {
  const { id } = useParams(); // Get election ID from URL
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchElectionData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get(`/elections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElection(response.data.details);
      setCandidates(response.data.candidates);
    } catch (err) {
      setError('Could not fetch election data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectionData();
  }, [id]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      await apiClient.post(`/elections/${id}/candidates`, 
        { fullName: candidateName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Candidate '${candidateName}' added successfully!`);
      setCandidateName(''); // Clear input
      fetchElectionData(); // Refresh the candidate list
    } catch (err) {
      setError('Failed to add candidate.');
    }
  };

  if (loading) return <div className="admin-page-container">Loading...</div>;
  if (error) return <div className="admin-page-container error-message">{error}</div>;

  return (
    <div className="admin-page-container">
      <Link to="/admin/elections" className="back-link">← Back to All Elections</Link>
      <h2>Manage: {election?.TITLE}</h2>
      
      <form onSubmit={handleAddCandidate} className="add-candidate-form">
        <h3>Add New Candidate</h3>
        <input 
          type="text" 
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Enter candidate's full name" 
          required 
        />
        <button type="submit">Add Candidate</button>
      </form>

      {message && <p className="status-message success">{message}</p>}
      {error && <p className="status-message error">{error}</p>}

      <div className="candidates-list">
        <h3>Current Candidates</h3>
        {candidates.length > 0 ? (
          <ul>
            {candidates.map(c => <li key={c.CANDIDATE_ID}>{c.FULL_NAME}</li>)}
          </ul>
        ) : (
          <p>No candidates have been added to this election yet.</p>
        )}
      </div>
    </div>
  );
}
export default ManageElectionPage;