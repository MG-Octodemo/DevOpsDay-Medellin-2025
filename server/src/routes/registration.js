const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration');

// Register for a talk
router.post('/:talkId', registrationController.registerForTalk);

// Cancel registration
router.delete('/:talkId', registrationController.cancelRegistration);

// Get user's registrations
router.get('/user', registrationController.getUserRegistrations);

// Get registrations for a talk
router.get('/talk/:talkId', registrationController.getTalkRegistrations);

module.exports = router;