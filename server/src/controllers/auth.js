const usersStore = require('../store/users');
const { generateToken } = require('../utils/jwtAuth');
const { validateRegistrationData, isValidEmail, validateUserUpdateData } = require('../utils/validation');
const {
  createErrorResponse,
  createValidationErrorResponse,
  createAuthErrorResponse,
  createNotFoundErrorResponse,
  asyncHandler,
  HTTP_STATUS
} = require('../utils/errorHandler');

// Register a new user
exports.register = asyncHandler(async (req, res) => {
  const { email, password, displayName } = req.body;
  
  // Validate input data
  const validation = validateRegistrationData({ email, password, displayName });
  if (!validation.isValid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createValidationErrorResponse(validation.errors)
    );
  }
  
  // Check if user already exists
  const existingUser = usersStore.findByEmail(email);
  if (existingUser) {
    return res.status(HTTP_STATUS.CONFLICT).json(
      createErrorResponse('User already exists with this email', HTTP_STATUS.CONFLICT, 'USER_EXISTS')
    );
  }
  
  // Create new user
  const newUser = await usersStore.create({
    email: email.toLowerCase().trim(),
    password,
    displayName: displayName ? displayName.trim() : '',
  });
  
  // Generate JWT token
  const token = generateToken(newUser);
  
  res.status(HTTP_STATUS.CREATED).json({ 
    success: true,
    message: 'User registered successfully',
    data: {
      user: newUser,
      token
    }
  });
});

// Login user
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createValidationErrorResponse(['Email and password are required'])
    );
  }
  
  if (!isValidEmail(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createValidationErrorResponse(['Invalid email format'])
    );
  }
  
  // Find user by email
  const user = usersStore.findByEmail(email.toLowerCase().trim());
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createAuthErrorResponse('Invalid email or password')
    );
  }
  
  // Verify password
  const isPasswordValid = await usersStore.verifyPassword(user, password);
  if (!isPasswordValid) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createAuthErrorResponse('Invalid email or password')
    );
  }
  
  // Generate JWT token
  const token = generateToken(user);
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(HTTP_STATUS.OK).json({ 
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      token
    }
  });
});

// Get user profile
exports.getProfile = asyncHandler(async (req, res) => {
  // User is already attached to req by the auth middleware
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createAuthErrorResponse('User not authenticated')
    );
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { user: req.user }
  });
});

// Update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createAuthErrorResponse('User not authenticated')
    );
  }
  
  // Validate and sanitize input data
  const validation = validateUserUpdateData(req.body);
  if (!validation.isValid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createValidationErrorResponse(validation.errors)
    );
  }
  
  const updatedUser = await usersStore.update(userId, validation.sanitizedData);
  
  if (!updatedUser) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createNotFoundErrorResponse('User')
    );
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser }
  });
});