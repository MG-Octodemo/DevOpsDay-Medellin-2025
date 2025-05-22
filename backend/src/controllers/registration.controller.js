const { Registration, User, Talk } = require('../models');

// Get all registrations
exports.getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Talk, attributes: ['id', 'title', 'startTime', 'room'] },
      ],
    });
    
    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// Get registrations by talk ID
exports.getRegistrationsByTalkId = async (req, res, next) => {
  try {
    const { talkId } = req.params;
    
    const registrations = await Registration.findAll({
      where: { talkId },
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
    });
    
    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// Create new registration
exports.createRegistration = async (req, res, next) => {
  try {
    const { name, email, talkId } = req.body;
    
    if (!name || !email || !talkId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and talkId',
      });
    }
    
    // Check if talk exists
    const talk = await Talk.findByPk(talkId);
    
    if (!talk) {
      return res.status(404).json({
        success: false,
        message: `Talk with id ${talkId} not found`,
      });
    }
    
    // Check if user already exists or create a new one
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { name },
    });
    
    // Check if already registered for this talk
    const existingRegistration = await Registration.findOne({
      where: {
        userId: user.id,
        talkId,
      },
    });
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this talk',
      });
    }
    
    // Create registration
    const registration = await Registration.create({
      userId: user.id,
      talkId,
    });
    
    return res.status(201).json({
      success: true,
      data: registration,
      message: 'Registration successful',
    });
  } catch (error) {
    next(error);
  }
};