const express = require('express');
const talkRoutes = require('./talk.routes');
const registrationRoutes = require('./registration.routes');

const router = express.Router();

// Mount routes
router.use('/talks', talkRoutes);
router.use('/registrations', registrationRoutes);

module.exports = router;