const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const db = new sqlite3.Database('database.sqlite');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Basic Authentication middleware
const basicAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="DevOps Day Registration"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get current user info
app.get('/api/me', basicAuth, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

// Get all talks
app.get('/api/talks', basicAuth, (req, res) => {
  db.all('SELECT * FROM talks ORDER BY schedule', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get user's registered talks
app.get('/api/my-registrations', basicAuth, (req, res) => {
  const query = `
    SELECT t.*, r.created_at as registered_at
    FROM talks t
    JOIN registrations r ON t.id = r.talk_id
    WHERE r.user_id = ?
    ORDER BY t.schedule
  `;
  
  db.all(query, [req.user.id], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Register for a talk
app.post('/api/talks/:id/register', basicAuth, (req, res) => {
  const talkId = parseInt(req.params.id);
  const userId = req.user.id;

  // First check if talk exists
  db.get('SELECT * FROM talks WHERE id = ?', [talkId], (err, talk) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    if (!talk) {
      return res.status(404).json({ error: 'Talk not found' });
    }

    // Try to register
    db.run(
      'INSERT INTO registrations (user_id, talk_id) VALUES (?, ?)',
      [userId, talkId],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Already registered for this talk' });
          }
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        
        res.status(201).json({ 
          message: 'Successfully registered for talk',
          registrationId: this.lastID 
        });
      }
    );
  });
});

// Unregister from a talk
app.delete('/api/talks/:id/register', basicAuth, (req, res) => {
  const talkId = parseInt(req.params.id);
  const userId = req.user.id;

  db.run(
    'DELETE FROM registrations WHERE user_id = ? AND talk_id = ?',
    [userId, talkId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      
      res.json({ message: 'Successfully unregistered from talk' });
    }
  );
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`DevOps Day Registration API running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});

module.exports = app;