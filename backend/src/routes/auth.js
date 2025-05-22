const express = require('express');
const router = express.Router();
const { createUser, validateUser, getUserById } = require('../models/users');
const { generateToken, auth } = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Create user
    const user = await createUser(username, password);

    // Generate token
    const token = generateToken(user.id);

    // Return token and user data
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        registeredTalks: user.registeredTalks
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Validate user
    const user = await validateUser(username, password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return token and user data
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        registeredTalks: user.registeredTalks
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user data (protected route)
router.get('/user', auth, async (req, res) => {
  try {
    const user = getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      registeredTalks: user.registeredTalks
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
