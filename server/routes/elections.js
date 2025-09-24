const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// GET all elections (Protected for any logged-in user)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sql = `SELECT election_id, title, description, start_date, end_date, status FROM Elections ORDER BY start_date DESC`;
    const result = await db.execute(sql);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching elections:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET a single election's details AND its candidates (Admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const electionSql = `SELECT election_id, title, description, status FROM Elections WHERE election_id = :id`;
    const candidatesSql = `SELECT candidate_id, full_name FROM Candidates WHERE election_id = :id`;
    
    const electionResult = await db.execute(electionSql, { id });
    const candidatesResult = await db.execute(candidatesSql, { id });

    if (electionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    res.status(200).json({
      details: electionResult.rows[0],
      candidates: candidatesResult.rows
    });
  } catch (err) {
    console.error(`Error fetching election ${req.params.id}:`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST a new election (Admin only)
router.post('/', [authenticateToken, isAdmin], async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  const createdBy = req.user.userId;
  try {
    const sql = `INSERT INTO Elections (title, description, start_date, end_date, created_by)
                 VALUES (:title, :description, TO_DATE(:startDate, 'YYYY-MM-DD'), TO_DATE(:endDate, 'YYYY-MM-DD'), :createdBy)`;
    const binds = { title, description, startDate, endDate, createdBy };
    await db.execute(sql, binds);
    res.status(201).json({ message: 'Election created successfully.' });
  } catch (err) {
    console.error('Error creating election:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST a new candidate to a specific election (Admin only)
router.post('/:electionId/candidates', [authenticateToken, isAdmin], async (req, res) => {
  const { fullName } = req.body;
  const { electionId } = req.params;
  if (!fullName) {
    return res.status(400).json({ message: 'Candidate name is required.' });
  }
  try {
    const sql = `INSERT INTO Candidates (full_name, election_id) VALUES (:fullName, :electionId)`;
    const binds = { fullName, electionId };
    await db.execute(sql, binds);
    res.status(201).json({ message: 'Candidate added successfully.' });
  } catch (err) {
    console.error('Error adding candidate:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE an election (Admin only)
router.delete('/:id', [authenticateToken, isAdmin], async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute(`DELETE FROM Votes WHERE election_id = :id`, { id });
    await db.execute(`DELETE FROM Candidates WHERE election_id = :id`, { id });
    await db.execute(`DELETE FROM Elections WHERE election_id = :id`, { id });
    res.status(200).json({ message: 'Election deleted successfully.' });
  } catch (err) {
    console.error('Error deleting election:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH an election's status to 'completed' (close it) (Admin only)
router.patch('/:id/close', [authenticateToken, isAdmin], async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `UPDATE Elections SET status = 'completed' WHERE election_id = :id`;
    await db.execute(sql, { id });
    res.status(200).json({ message: 'Election closed successfully.' });
  } catch (err) {
    console.error('Error closing election:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET raw results for an election (Admin only)
router.get('/:id/results', [authenticateToken, isAdmin], async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `SELECT c.candidate_id, c.full_name, COUNT(v.vote_id) as vote_count
                 FROM Candidates c
                 LEFT JOIN Votes v ON c.candidate_id = v.candidate_id
                 WHERE c.election_id = :id
                 GROUP BY c.candidate_id, c.full_name
                 ORDER BY vote_count DESC`;
    const result = await db.execute(sql, { id });
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH an election's status to 'published' (Admin only)
router.patch('/:id/publish', [authenticateToken, isAdmin], async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `UPDATE Elections SET status = 'published' WHERE election_id = :id`;
    await db.execute(sql, { id });
    res.status(200).json({ message: 'Results published successfully.' });
  } catch (err) {
    console.error('Error publishing results:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET public results for an election (Any logged-in user)
router.get('/:id/public-results', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const electionStatusSql = `SELECT status FROM Elections WHERE election_id = :id`;
    const electionResult = await db.execute(electionStatusSql, { id });

    if (electionResult.rows.length === 0 || electionResult.rows[0].STATUS !== 'published') {
      return res.status(403).json({ message: 'Results are not yet published.' });
    }

    const resultsSql = `SELECT c.candidate_id, c.full_name, COUNT(v.vote_id) as vote_count
                        FROM Candidates c
                        LEFT JOIN Votes v ON c.candidate_id = v.candidate_id
                        WHERE c.election_id = :id
                        GROUP BY c.candidate_id, c.full_name
                        ORDER BY vote_count DESC`;
    const result = await db.execute(resultsSql, { id });
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching public results:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;