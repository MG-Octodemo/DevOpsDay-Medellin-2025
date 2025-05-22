const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/talks', require('./routes/talks'));
app.use('/api/profile', require('./routes/profile'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'API para DevOpsDay Medellín 2025' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
