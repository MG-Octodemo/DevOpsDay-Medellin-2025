const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Firebase will handle most auth flows directly on the client
// These endpoints are for server-side operations and validation

// Verify token
router.post('/verify-token', authController.verifyToken);

// Get user profile
router.get('/profile', authController.getProfile);

// Update user profile
router.put('/profile', authController.updateProfile);

module.exports = router;