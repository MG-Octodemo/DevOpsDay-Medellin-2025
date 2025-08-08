const authMiddleware = require('../utils/auth');

// Add routes that require authentication
const express = require('express');
const router = express.Router();

// Apply auth middleware to routes that require authentication
router.use('/api/auth/profile', authMiddleware.authenticate);
router.use('/api/registration', authMiddleware.authenticate);

// Admin-only routes
const adminRoutes = [
  { path: '/api/talks', method: 'post' },
  { path: '/api/talks/:id', method: 'put' },
  { path: '/api/talks/:id', method: 'delete' },
  { path: '/api/registration/talk/:talkId', method: 'get' }
];

// Apply admin middleware to admin-only routes
adminRoutes.forEach(route => {
  router[route.method](route.path, authMiddleware.authenticate, authMiddleware.isAdmin);
});

module.exports = router;