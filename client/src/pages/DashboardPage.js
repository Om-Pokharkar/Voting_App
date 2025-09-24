import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import ElectionCard from '../components/ElectionCard';
import './StudentPages.css'; // Use the new shared CSS file

function DashboardPage() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]      = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        // The apiClient interceptor automatically adds the token
        const response = await apiClient.get('/elections');
        setElections(response.data);
      } catch (err) {
        setError('Failed to fetch elections. Please log in again.');
      } finally {
        // This line is crucial to stop the "loading" state
        setLoading(false);
      }
    };

    fetchElections();
  }, []); // The empty array ensures this runs only once when the page loads

  // Render different UI based on the state
  if (loading) {
    return <div className="student-page-container"><h2>Loading...</h2></div>;
  }
  
  if (error) {
    return <div className="student-page-container error-message">{error}</div>;
  }

  return (
    <div className="student-page-container">
      <h2>Active Elections</h2>
      <div className="elections-list">
        {elections.length > 0 ? (
          elections.map(election => (
            <ElectionCard key={election.ELECTION_ID} election={election} />
          ))
        ) : (
          <p>No active elections at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;