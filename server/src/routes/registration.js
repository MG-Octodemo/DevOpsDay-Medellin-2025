const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration');
const { authenticate, isAdmin } = require('../utils/jwtAuth');

// All registration routes require authentication
router.use(authenticate);

// Register for a talk
router.post('/:talkId', registrationController.registerForTalk);

// Cancel registration
router.delete('/:talkId', registrationController.cancelRegistration);

// Get user's registrations
router.get('/user', registrationController.getUserRegistrations);

// Get registrations for a talk (admin only)
router.get('/talk/:talkId', isAdmin, registrationController.getTalkRegistrations);

module.exports = router;