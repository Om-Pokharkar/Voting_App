const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST a new vote (Any logged-in user)
router.post('/', authenticateToken, async (req, res) => {
  const { electionId, candidateId } = req.body;
  const userId = req.user.userId; // Get user ID from the authenticated token

  try {
    const sql = `INSERT INTO Votes (user_id, election_id, candidate_id) VALUES (:userId, :electionId, :candidateId)`;
    const binds = { userId, electionId, candidateId };
    
    await db.execute(sql, binds);
    res.status(201).json({ message: 'Vote cast successfully!' });
  } catch (err) {
    // Check for the unique constraint violation error (ORA-00001)
    if (err.errorNum === 1) {
      return res.status(409).json({ message: 'You have already voted in this election.' });
    }
    console.error('Error casting vote:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;