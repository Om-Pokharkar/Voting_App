const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Get the token from the 'Authorization' header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (token is no longer valid)
    }
    // If the token is valid, attach the user payload to the request object
    req.user = user;
    next(); // Proceed to the next function in the chain
  });
}

function isAdmin(req, res, next) {
  // This middleware must run *after* authenticateToken
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
}

module.exports = { authenticateToken, isAdmin };