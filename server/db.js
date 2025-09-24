// Load environment variables from .env file
require('dotenv').config();

// Import the oracledb library
const oracledb = require('oracledb');

// This forces the driver to return all string-like columns as JavaScript strings.
// It's the fix for the 'undefined' password issue.
//oracledb.fetchAsString = [ oracledb.DB_TYPE_VARCHAR ];

// Configure the Oracle client (usually only needed on Windows)
// oracledb.initOracleClient({ libDir: 'C:\\path\\to\\your\\instantclient' });

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

// Asynchronous function to initialize the database connection pool
async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Database connection pool started successfully.');
  } catch (err) {
    console.error('Error starting database connection pool:', err);
  }
}

// Function to execute SQL queries
// In server/db.js

async function execute(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    // This option ensures results are returned as easy-to-use objects
    options.outFormat = oracledb.OUT_FORMAT_OBJECT; 
    options.autoCommit = true;

    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.error('DATABASE EXECUTE ERROR:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Export the initialize and execute functions to be used in other files
module.exports = { initialize, execute };