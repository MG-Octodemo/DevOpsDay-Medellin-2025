const registrationsStore = require('../store/registrations');
const talksStore = require('../store/talks');
const usersStore = require('../store/users');
const emailService = require('../services/email');
const {
  createErrorResponse,
  createNotFoundErrorResponse,
  createAuthErrorResponse,
  asyncHandler,
  HTTP_STATUS
} = require('../utils/errorHandler');

// Register user for a talk
exports.registerForTalk = asyncHandler(async (req, res) => {
  const { talkId } = req.params;
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createAuthErrorResponse('User authentication required')
    );
  }
  
  if (!talkId || typeof talkId !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createErrorResponse('Invalid talk ID format', HTTP_STATUS.BAD_REQUEST, 'INVALID_TALK_ID')
    );
  }

  // Auto-create user in usersStore if not found
  let user = usersStore.findById(userId);
  if (!user) {
    // Use info from req.user (populated by auth middleware)
    user = await usersStore.create({
      id: userId,
      displayName: req.user.displayName || req.user.name || 'Anonymous',
      email: req.user.email || '',
      company: req.user.company || '',
      jobTitle: req.user.jobTitle || ''
    });
  }

  // Check if talk exists
  const talk = talksStore.findById(talkId);
  if (!talk) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createNotFoundErrorResponse('Talk')
    );
  }
  
  // Check if user is already registered
  const existingRegistration = registrationsStore.findByUserAndTalk(userId, talkId);
  if (existingRegistration) {
    return res.status(HTTP_STATUS.CONFLICT).json(
      createErrorResponse('User is already registered for this talk', HTTP_STATUS.CONFLICT, 'ALREADY_REGISTERED')
    );
  }
  
  // Check if max attendees limit reached
  if (talk.maxAttendees !== null) {
    const registrationsCount = registrationsStore.findByTalkId(talkId).length;
    if (registrationsCount >= talk.maxAttendees) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Talk has reached maximum capacity', HTTP_STATUS.BAD_REQUEST, 'CAPACITY_REACHED')
      );
    }
  }
  
  // Create new registration
  const registration = registrationsStore.create({
    userId,
    talkId,
    registrationDate: new Date()
  });
  
  // Send confirmation email (commented out as email service might not be configured)
  /*
  try {
    if (user.email) {
      await emailService.sendRegistrationConfirmation(
        user.email,
        user.displayName,
        talk.title,
        talk.startTime
      );
    }
  } catch (emailError) {
    // Log email error but don't fail the registration
    console.error('Failed to send confirmation email:', emailError);
  }
  */
  
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Registration successful',
    data: { registration, talk }
  });
});

// Cancel registration
exports.cancelRegistration = asyncHandler(async (req, res) => {
  const { talkId } = req.params;
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createAuthErrorResponse('User authentication required')
    );
  }
  
  if (!talkId || typeof talkId !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createErrorResponse('Invalid talk ID format', HTTP_STATUS.BAD_REQUEST, 'INVALID_TALK_ID')
    );
  }
  
  const registration = registrationsStore.findByUserAndTalk(userId, talkId);
  if (!registration) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createNotFoundErrorResponse('Registration')
    );
  }
  
  const result = registrationsStore.delete(registration.id);
  if (result) {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } else {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to cancel registration', HTTP_STATUS.INTERNAL_SERVER_ERROR, 'CANCEL_FAILED')
    );
  }
});

// Get all registrations for a user
exports.getUserRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createAuthErrorResponse('User authentication required')
    );
  }
  
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
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { registrations: enhancedRegistrations },
    count: enhancedRegistrations.length
  });
});

// Get all registrations for a talk (admin only)
exports.getTalkRegistrations = asyncHandler(async (req, res) => {
  const { talkId } = req.params;
  
  if (!talkId || typeof talkId !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createErrorResponse('Invalid talk ID format', HTTP_STATUS.BAD_REQUEST, 'INVALID_TALK_ID')
    );
  }
  
  // Check if talk exists
  const talk = talksStore.findById(talkId);
  if (!talk) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createNotFoundErrorResponse('Talk')
    );
  }
  
  const registrations = registrationsStore.findByTalkId(talkId);
  
  // Enhance registrations with user details (excluding sensitive info)
  const enhancedRegistrations = registrations.map(registration => {
    const user = usersStore.findById(registration.userId);
    const { displayName, email } = user || { displayName: 'Unknown', email: 'unknown@example.com' };
    return { ...registration, user: { displayName, email } };
  });
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { 
      talk: { id: talk.id, title: talk.title, maxAttendees: talk.maxAttendees },
      registrations: enhancedRegistrations 
    },
    count: enhancedRegistrations.length,
    availableSpots: talk.maxAttendees ? Math.max(0, talk.maxAttendees - enhancedRegistrations.length) : 'unlimited'
  });
});