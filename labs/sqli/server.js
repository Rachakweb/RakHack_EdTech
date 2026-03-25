const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for the login page
app.use(express.static(path.join(__dirname, 'public')));

// Initialize an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Create a users table
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    flag TEXT
  )`);

  // Insert a dummy user and the admin with the flag
  db.run(`INSERT INTO users (username, password, flag) VALUES ('johndoe', 'password123', 'No flag here.')`);
  db.run(`INSERT INTO users (username, password, flag) VALUES ('admin', 'super_secret_impossible_password', 'RakHack{SQLi_M4st3r_2026}')`);

  console.log('Database initialized with vulnerable credentials.');
});

// VULNERABLE LOGIN ENDPOINT
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // IMPORTANT: This is intentionally vulnerable to SQL injection
  // The username and password are directly concatenated into the query string
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  console.log(`Executing Query: ${query}`);

  db.get(query, (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }

    if (row) {
      // Login successful!
      return res.json({ 
        success: true, 
        message: 'Login successful. Welcome Administrator.',
        flag: row.flag 
      });
    } else {
      // Login failed
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.listen(port, () => {
  console.log(`Vulnerable SQLi Lab running at http://localhost:${port}`);
  console.log(`Can you bypass the login and steal the flag?`);
});
