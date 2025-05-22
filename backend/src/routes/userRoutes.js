const express = require('express');
const router = express.Router();
const { findUserById, registerUserToTalk, unregisterUserFromTalk } = require('../models/userModel');
const { getTalkById } = require('../models/talkModel');
const { auth } = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, (req, res) => {
  try {
    const user = findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Don't send password to client
    const { password, ...userData } = user;
    
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Register user to talk
router.post('/register-talk/:talkId', auth, (req, res) => {
  try {
    const { talkId } = req.params;
    const talk = getTalkById(talkId);
    
    if (!talk) {
      return res.status(404).json({ message: 'Charla no encontrada' });
    }
    
    const registered = registerUserToTalk(req.userId, parseInt(talkId));
    
    if (!registered) {
      return res.status(400).json({ message: 'Ya estás registrado a esta charla o hubo un error' });
    }
    
    res.status(200).json({ message: 'Registro exitoso a la charla' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Unregister user from talk
router.post('/unregister-talk/:talkId', auth, (req, res) => {
  try {
    const { talkId } = req.params;
    
    const unregistered = unregisterUserFromTalk(req.userId, parseInt(talkId));
    
    if (!unregistered) {
      return res.status(400).json({ message: 'No estás registrado a esta charla o hubo un error' });
    }
    
    res.status(200).json({ message: 'Desregistro exitoso de la charla' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Get registered talks for user
router.get('/registered-talks', auth, (req, res) => {
  try {
    const user = findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const registeredTalks = user.charlasRegistradas.map(talkId => {
      return getTalkById(talkId);
    }).filter(talk => talk !== undefined);
    
    res.status(200).json(registeredTalks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;