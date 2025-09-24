import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './VotingPage.css';

function VotingPage() {
  const { id } = useParams(); // Gets the election ID from the URL (e.g., /election/1)
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const response = await apiClient.get(`/elections/${id}`);
        setElection(response.data.details);
        setCandidates(response.data.candidates);
      } catch (err) {
        setError('Could not fetch election data. It may be closed or not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchElectionData();
  }, [id]);

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
      setError('Please select a candidate before submitting.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await apiClient.post('/votes', {
        electionId: id,
        candidateId: selectedCandidate
      });
      setMessage('Your vote has been cast successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect back to dashboard after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote. You might have already voted.');
    }
  };
  
  if (loading) return <div className="voting-page-container"><h2>Loading...</h2></div>;
  if (error && !message) return <div className="voting-page-container"><p className="status-message error">{error}</p></div>;

  return (
    <div className="voting-page-container">
      <div className="voting-form-container">
        <h2>{election?.TITLE}</h2>
        <p>{election?.DESCRIPTION}</p>
        <form onSubmit={handleVoteSubmit}>
          <div className="candidates-list">
            {candidates.map(candidate => (
              <label 
                key={candidate.CANDIDATE_ID} 
                className={`candidate-option ${selectedCandidate === String(candidate.CANDIDATE_ID) ? 'selected' : ''}`}
              >
                <input 
                  type="radio" 
                  name="candidate" 
                  value={candidate.CANDIDATE_ID}
                  checked={selectedCandidate === String(candidate.CANDIDATE_ID)}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                />
                <span className="candidate-name">{candidate.FULL_NAME}</span>
              </label>
            ))}
          </div>
          <button type="submit" className="submit-vote-btn" disabled={!selectedCandidate || message}>
            Cast Your Vote
          </button>
          {message && <p className="status-message success">{message}</p>}
          {error && !message && <p className="status-message error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default VotingPage;