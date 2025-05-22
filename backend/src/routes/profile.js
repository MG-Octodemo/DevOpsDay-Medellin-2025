const express = require('express');
const router = express.Router();
const { getUserRegisteredTalks, getUserById } = require('../models/users');
const { getTalkById } = require('../models/talks');
const { auth } = require('../middleware/auth');

// Get user profile with registered talks (protected route)
router.get('/', auth, (req, res) => {
  try {
    // Get user
    const user = getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get registered talk IDs
    const registeredTalkIds = getUserRegisteredTalks(req.user.id);
    
    // Get full talk details for each registered talk
    const registeredTalks = registeredTalkIds.map(id => getTalkById(id));

    // Return user profile with registered talks
    res.json({
      user: {
        id: user.id,
        username: user.username
      },
      registeredTalks
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
