const express = require('express');
const router = express.Router();
const { getAllTalks, getTalkById } = require('../models/talks');
const { registerUserToTalk } = require('../models/users');
const { auth } = require('../middleware/auth');

// Get all talks
router.get('/', (req, res) => {
  try {
    const talks = getAllTalks();
    res.json(talks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific talk
router.get('/:id', (req, res) => {
  try {
    const talk = getTalkById(req.params.id);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.json(talk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register user to a talk (protected route)
router.post('/:id/register', auth, (req, res) => {
  try {
    const talkId = parseInt(req.params.id);
    const talk = getTalkById(talkId);
    
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    
    const updatedUser = registerUserToTalk(req.user.id, talkId);
    
    res.json({
      message: 'Registrado exitosamente a la charla',
      user: updatedUser,
      talk: talk
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
