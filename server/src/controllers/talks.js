const Talk = require('../models/talk');

// Get all talks
exports.getAllTalks = async (req, res) => {
  try {
    const talks = await Talk.find();
    res.status(200).json(talks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching talks', error: error.message });
  }
};

// Get talk by ID
exports.getTalkById = async (req, res) => {
  try {
    const talk = await Talk.findById(req.params.id);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.status(200).json(talk);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching talk', error: error.message });
  }
};

// Create a new talk
exports.createTalk = async (req, res) => {
  try {
    const newTalk = new Talk(req.body);
    const savedTalk = await newTalk.save();
    res.status(201).json(savedTalk);
  } catch (error) {
    res.status(400).json({ message: 'Error creating talk', error: error.message });
  }
};

// Update a talk
exports.updateTalk = async (req, res) => {
  try {
    const updatedTalk = await Talk.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTalk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.status(200).json(updatedTalk);
  } catch (error) {
    res.status(400).json({ message: 'Error updating talk', error: error.message });
  }
};

// Delete a talk
exports.deleteTalk = async (req, res) => {
  try {
    const deletedTalk = await Talk.findByIdAndDelete(req.params.id);
    if (!deletedTalk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.status(200).json({ message: 'Talk deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting talk', error: error.message });
  }
};