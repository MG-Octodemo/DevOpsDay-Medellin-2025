const express = require('express');
const router = express.Router();
const talksController = require('../controllers/talks');

// Get all talks
router.get('/', talksController.getAllTalks);

// Get specific talk by ID
router.get('/:id', talksController.getTalkById);

// Admin routes to manage talks
router.post('/', talksController.createTalk);
router.put('/:id', talksController.updateTalk);
router.delete('/:id', talksController.deleteTalk);

module.exports = router;