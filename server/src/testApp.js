const express = require('express');
const cors = require('cors');

// Import routes
const talksRoutes = require('./routes/talks');

// Initialize express app for testing
const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Routes
  app.use('/api/talks', talksRoutes);
  
  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Test server is running' });
  });
  
  return app;
};

module.exports = createTestApp;