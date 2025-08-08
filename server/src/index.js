const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const talksRoutes = require('./routes/talks');
const authRoutes = require('./routes/auth');
const registrationRoutes = require('./routes/registration');

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/talks', talksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/registration', registrationRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // For testing purposes