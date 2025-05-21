const Registration = require('../models/registration');
const Talk = require('../models/talk');
const User = require('../models/user');
const emailService = require('../services/email');

// Register user for a talk
exports.registerForTalk = async (req, res) => {
  try {
    const { talkId } = req.params;
    const userId = req.user.id;
    
    // Check if talk exists
    const talk = await Talk.findById(talkId);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: userId,
      talk: talkId
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'User already registered for this talk' });
    }
    
    // Create new registration
    const registration = new Registration({
      user: userId,
      talk: talkId,
      registrationDate: new Date()
    });
    
    await registration.save();
    
    // Get user email for confirmation
    const user = await User.findById(userId);
    
    // Send confirmation email
    await emailService.sendRegistrationConfirmation(
      user.email,
      user.displayName,
      talk.title,
      talk.startTime
    );
    
    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for talk', error: error.message });
  }
};

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const { talkId } = req.params;
    const userId = req.user.id;
    
    const registration = await Registration.findOneAndDelete({
      user: userId,
      talk: talkId
    });
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling registration', error: error.message });
  }
};

// Get all registrations for a user
exports.getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const registrations = await Registration.find({ user: userId })
      .populate('talk')
      .sort({ 'talk.startTime': 1 });
    
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
};

// Get all registrations for a talk
exports.getTalkRegistrations = async (req, res) => {
  try {
    const { talkId } = req.params;
    
    // Check if talk exists
    const talk = await Talk.findById(talkId);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    
    const registrations = await Registration.find({ talk: talkId })
      .populate('user', 'displayName email');
    
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
};