// In client/src/components/ElectionCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ElectionCard.css';

function ElectionCard({ election }) {
  const navigate = useNavigate(); // Hook for navigation

  const handleVoteClick = () => {
    navigate(`/election/${election.ELECTION_ID}`);
  };

  return (
    <div className="election-card">
      <h3>{election.TITLE}</h3>
      <p>{election.DESCRIPTION}</p>
      <div className="election-dates">
        <span>Starts: {new Date(election.START_DATE).toLocaleDateString()}</span>
        <span>Ends: {new Date(election.END_DATE).toLocaleDateString()}</span>
      </div>
      {/* Attach the click handler to the button */}
      <button onClick={handleVoteClick} className="vote-now-btn">Vote Now</button>
    </div>
  );
}

export default ElectionCard;