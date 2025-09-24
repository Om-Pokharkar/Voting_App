const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { studentId, password } = req.body;

  try {
    // --- THIS IS THE CRITICAL LINE THAT NEEDS TO BE CORRECT ---
    // It must include the 'password' column to be returned.
    const sql = `SELECT user_id, student_id, password, user_role FROM Users WHERE UPPER(student_id) = UPPER(:studentId)`;
    
    const binds = { studentId: studentId };

    const result = await db.execute(sql, binds);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = result.rows[0];

    // This is the line that was causing the error because user.PASSWORD was undefined
    const dbPassword = user.PASSWORD;
    const clientPassword = password;

    console.log('--- PASSWORD DEBUG ---');
    console.log(`DB Pass: '${dbPassword}', Type: ${typeof dbPassword}`);
    console.log(`Client Pass: '${clientPassword}', Type: ${typeof clientPassword}`);
    console.log('----------------------');

    // Compare the submitted password with the one in the database
    if (clientPassword !== dbPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // If credentials are correct, create a JWT
    const payload = {
      userId: user.USER_ID,
      studentId: user.STUDENT_ID,
      role: user.USER_ROLE
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;