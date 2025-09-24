// In client/src/pages/ResultsPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import './StudentPages.css'; // Reuse the student styles

function ResultsPage() {
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState(null);
  const [selectedElection, setSelectedElection] = useState(null);
  const [error, setError] = useState('');

  // Fetch all elections
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await apiClient.get('/elections');
        // Filter for only completed or published elections
        setElections(response.data.filter(e => e.STATUS === 'completed' || e.STATUS === 'published'));
      } catch (err) {
        setError('Could not fetch elections.');
      }
    };
    fetchElections();
  }, []);

  // Fetch results for the selected election
  const handleViewResults = async (election) => {
    setSelectedElection(election);
    setResults(null); // Clear previous results
    setError('');
    try {
      const response = await apiClient.get(`/elections/${election.ELECTION_ID}/public-results`);
      setResults(response.data);
    } catch (err) {
      // The backend sends a 403 if not published, with a specific message
      setError(err.response?.data?.message || 'Could not fetch results.');
    }
  };

  return (
    <div className="student-page-container">
      <h2>Election Results</h2>
      <div className="elections-list-results">
        <h3>Select an Election to View Results</h3>
        {elections.map(election => (
          <div key={election.ELECTION_ID} className="election-result-item">
            <span>{election.TITLE}</span>
            <button onClick={() => handleViewResults(election)} className="btn">View Results</button>
          </div>
        ))}
      </div>
      
      {selectedElection && results && (
        <div className="results-display">
          <h3>Results for: {selectedElection.TITLE}</h3>
          <ul>
            {results.map(result => (
              <li key={result.CANDIDATE_ID}>
                <strong>{result.FULL_NAME}:</strong> {result.VOTE_COUNT} votes
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ResultsPage;