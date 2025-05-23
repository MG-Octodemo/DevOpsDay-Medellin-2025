const express = require('express');
const router = express.Router();
const { getAllTalks, getTalkById } = require('../models/talkModel');
const { auth } = require('../middleware/auth');

// Get all talks
router.get('/', (req, res) => {
  try {
    const talks = getAllTalks();
    res.status(200).json(talks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Get talk by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const talk = getTalkById(id);
    
    if (!talk) {
      return res.status(404).json({ message: 'Charla no encontrada' });
    }
    
    res.status(200).json(talk);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;