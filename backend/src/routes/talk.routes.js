const express = require('express');
const talkController = require('../controllers/talk.controller');

const router = express.Router();

// GET /api/talks - Get all talks
router.get('/', talkController.getAllTalks);

// GET /api/talks/:id - Get talk by ID
router.get('/:id', talkController.getTalkById);

module.exports = router;