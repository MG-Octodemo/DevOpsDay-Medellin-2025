const express = require('express');
const registrationController = require('../controllers/registration.controller');

const router = express.Router();

// GET /api/registrations - Get all registrations
router.get('/', registrationController.getAllRegistrations);

// GET /api/registrations/:talkId - Get registrations by talk ID
router.get('/talk/:talkId', registrationController.getRegistrationsByTalkId);

// POST /api/registrations - Create new registration
router.post('/', registrationController.createRegistration);

module.exports = router;