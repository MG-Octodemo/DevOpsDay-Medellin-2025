const express = require('express');
const router = express.Router();
const talksController = require('../controllers/talks');
const { authenticate, isAdmin } = require('../utils/jwtAuth');

// Public routes
router.get('/', talksController.getAllTalks);
router.get('/:id', talksController.getTalkById);

// Admin routes to manage talks
router.post('/', authenticate, isAdmin, talksController.createTalk);
router.put('/:id', authenticate, isAdmin, talksController.updateTalk);
router.delete('/:id', authenticate, isAdmin, talksController.deleteTalk);

module.exports = router;