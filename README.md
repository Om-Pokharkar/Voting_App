University Voting Application
This is a full-stack web application designed to serve as a basic voting platform for a college or university. It features separate interfaces for student users and administrators, allowing for secure and organized online elections.

✨ Features
Dual User Roles: Separate login and dashboard experiences for Students and Admins.

Admin Panel:

Create, view, and manage elections.

Add candidates to specific elections.

Securely close elections to stop voting.

Publish election results at their discretion.

Delete elections and all associated data.

Student Portal:

Secure login for student users.

View a list of active elections.

Cast a vote in an election, with a one-vote-per-user limit enforced by the backend.

View the results of published elections.

Secure API: Backend endpoints are protected using JWT (JSON Web Tokens) to ensure only authenticated and authorized users can perform actions.

🛠️ Technology Stack
Frontend: React.js, React Router, Axios

Backend: Node.js, Express.js

Database: Oracle Database

Authentication: JSON Web Tokens (JWT)

🚀 Setup and Installation
Follow these steps to get the project running on your local machine.

Prerequisites
Node.js installed

An active Oracle Database instance

1. Backend Setup (server)
Navigate to the server directory:

Bash

cd server
Install dependencies:

Bash

npm install
Create a .env file:
Create a file named .env in the server directory and add your database credentials and a JWT secret:

Code snippet

DB_USER=VOTING_APP_USER
DB_PASSWORD=your_db_password
DB_CONNECT_STRING=localhost/your_pdb_service_name
JWT_SECRET=your_super_secret_key
Set up the database:
Connect to your Oracle database as an admin and run the SQL scripts to create the VOTING_APP_USER and the necessary tables.

2. Frontend Setup (client)
Navigate to the client directory:

Bash

cd client
Install dependencies:

Bash

npm install
▶️ Running the Application
You need to have two terminals open to run both the frontend and backend servers simultaneously.

Start the Backend Server:

In a terminal, navigate to the server directory and run:

Bash

node server.js
The server will be running on http://localhost:5000.

Start the Frontend Application:

In a second terminal, navigate to the client directory and run:

Bash

npm start
Your browser will open to http://localhost:3000, where you can access the application.

