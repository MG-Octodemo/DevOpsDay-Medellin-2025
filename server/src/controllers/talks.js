const talksStore = require('../store/talks');

// Get all talks
exports.getAllTalks = (req, res) => {
  try {
    const talks = talksStore.findAll();
    res.status(200).json(talks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching talks', error: error.message });
  }
};

// Get talk by ID
exports.getTalkById = (req, res) => {
  try {
    const talk = talksStore.findById(req.params.id);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.status(200).json(talk);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching talk', error: error.message });
  }
};

// Create a new talk
exports.createTalk = (req, res) => {
  try {
    const newTalk = talksStore.create(req.body);
    res.status(201).json(newTalk);
  } catch (error) {
    res.status(400).json({ message: 'Error creating talk', error: error.message });
  }
};

// Update a talk
exports.updateTalk = (req, res) => {
  try {
    const updatedTalk = talksStore.update(req.params.id, req.body);
    if (!updatedTalk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.status(200).json(updatedTalk);
  } catch (error) {
    res.status(400).json({ message: 'Error updating talk', error: error.message });
  }
};

// Delete a talk
exports.deleteTalk = (req, res) => {
  try {
    const talk = talksStore.findById(req.params.id);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    
    const result = talksStore.delete(req.params.id);
    if (result) {
      res.status(200).json({ message: 'Talk deleted successfully' });
    } else {
      res.status(500).json({ message: 'Error deleting talk' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting talk', error: error.message });
  }
};