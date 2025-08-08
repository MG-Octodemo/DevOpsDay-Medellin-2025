const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticate } = require('../utils/jwtAuth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;