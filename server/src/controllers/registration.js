const registrationsStore = require('../store/registrations');
const talksStore = require('../store/talks');
const usersStore = require('../store/users');
const emailService = require('../services/email');

// Register user for a talk
exports.registerForTalk = (req, res) => {
  try {
    const { talkId } = req.params;
    const userId = req.user.id;
    
    // Check if talk exists
    const talk = talksStore.findById(talkId);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    
    // Check if max attendees limit reached
    if (talk.maxAttendees !== null) {
      const registrationsCount = registrationsStore.findByTalkId(talkId).length;
      if (registrationsCount >= talk.maxAttendees) {
        return res.status(400).json({ message: 'Talk has reached maximum capacity' });
      }
    }
    
    // Create new registration
    try {
      const registration = registrationsStore.create({
        userId,
        talkId,
        registrationDate: new Date()
      });
      
      // Get user for confirmation
      const user = usersStore.findById(userId);
      
      // Send confirmation email
      // Note: You may want to comment this out if email service is not configured
      /*
      emailService.sendRegistrationConfirmation(
        user.email,
        user.displayName,
        talk.title,
        talk.startTime
      );
      */
      
      res.status(201).json({ message: 'Registration successful', registration });
    } catch (error) {
      // This might be due to duplicate registration
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error registering for talk', error: error.message });
  }
};

// Cancel registration
exports.cancelRegistration = (req, res) => {
  try {
    const { talkId } = req.params;
    const userId = req.user.id;
    
    const registration = registrationsStore.findByUserAndTalk(userId, talkId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    const result = registrationsStore.delete(registration.id);
    if (result) {
      res.status(200).json({ message: 'Registration cancelled successfully' });
    } else {
      res.status(500).json({ message: 'Error cancelling registration' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling registration', error: error.message });
  }
};

// Get all registrations for a user
exports.getUserRegistrations = (req, res) => {
  try {
    const userId = req.user.id;
    
    const registrations = registrationsStore.findByUserId(userId);
    
    // Enhance registrations with talk details
    const enhancedRegistrations = registrations.map(registration => {
      const talk = talksStore.findById(registration.talkId);
      return { ...registration, talk };
    });
    
    // Sort by talk start time
    enhancedRegistrations.sort((a, b) => {
      if (a.talk && b.talk) {
        return new Date(a.talk.startTime) - new Date(b.talk.startTime);
      }
      return 0;
    });
    
    res.status(200).json(enhancedRegistrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
};

// Get all registrations for a talk
exports.getTalkRegistrations = (req, res) => {
  try {
    const { talkId } = req.params;
    
    // Check if talk exists
    const talk = talksStore.findById(talkId);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    
    const registrations = registrationsStore.findByTalkId(talkId);
    
    // Enhance registrations with user details (excluding sensitive info)
    const enhancedRegistrations = registrations.map(registration => {
      const user = usersStore.findById(registration.userId);
      const { displayName, email } = user || { displayName: 'Unknown', email: 'unknown@example.com' };
      return { ...registration, user: { displayName, email } };
    });
    
    res.status(200).json(enhancedRegistrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
};