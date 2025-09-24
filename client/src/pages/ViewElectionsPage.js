import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import './AdminPages.css';

function ViewElectionsPage() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get('/elections', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElections(response.data);
    } catch (err) {
      setError('Could not fetch elections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleAction = async (action, id) => {
    const token = localStorage.getItem('token');
    const actions = {
      delete: { method: 'delete', url: `/elections/${id}` },
      close: { method: 'patch', url: `/elections/${id}/close` },
      publish: { method: 'patch', url: `/elections/${id}/publish` },
    };
    
    if (window.confirm(`Are you sure you want to ${action} this election?`)) {
      try {
        await apiClient[actions[action].method](actions[action].url, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(`Election ${action}d successfully.`);
        fetchElections(); // Refresh the list
      } catch (err) {
        setError(`Failed to ${action} election.`);
      }
    }
  };

  if (loading) return <div className="admin-page-container">Loading...</div>;
  if (error) return <div className="admin-page-container error-message">{error}</div>;

  return (
    <div className="admin-page-container">
      <h2>Manage Elections</h2>
      {message && <p className="status-message success">{message}</p>}
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {elections.map(e => (
              <tr key={e.ELECTION_ID}>
                <td>{e.TITLE}</td>
                <td><span className={`status ${e.STATUS?.toLowerCase()}`}>{e.STATUS}</span></td>
                <td className="actions-cell">
                  <Link to={`/admin/election/${e.ELECTION_ID}/manage`} className="btn manage">Manage</Link>
                  <button onClick={() => handleAction('close', e.ELECTION_ID)} className="btn close">Close</button>
                  <button onClick={() => handleAction('publish', e.ELECTION_ID)} className="btn publish">Publish</button>
                  <button onClick={() => handleAction('delete', e.ELECTION_ID)} className="btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ViewElectionsPage;