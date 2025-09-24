const express = require('express');
const cors = require('cors');

// Import local modules
const db = require('./db');
const authRouter = require('./routes/auth');
const electionsRouter = require('./routes/elections');
const votesRouter = require('./routes/votes');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routers
app.use('/api/auth', authRouter);
app.use('/api/elections', electionsRouter);
app.use('/api/votes', votesRouter);

// A simple root route to test if the server is running
app.get('/', (req, res) => {
  res.send('Voting App Server is running!');
});

// Server Startup Logic
async function startup() {
  console.log('Starting application...');
  try {
    console.log('Initializing database module...');
    await db.initialize();
    console.log('Database pool initialized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('FATAL ERROR DURING STARTUP:', err);
    process.exit(1);
  }
}

// Execute the startup function
startup();