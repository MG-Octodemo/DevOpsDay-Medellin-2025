const usersStore = require('../store/users');
const { generateToken } = require('../utils/jwtAuth');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Check if user already exists
    const existingUser = usersStore.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const newUser = await usersStore.create({
      email,
      password,
      displayName: displayName || '',
    });
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: newUser,
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = usersStore.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isPasswordValid = await usersStore.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Don't return password in response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({ 
      message: 'Login successful',
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Get user profile
exports.getProfile = (req, res) => {
  try {
    // User is already attached to req by the auth middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { displayName, company, jobTitle, photoURL } = req.body;
    
    const updatedUser = await usersStore.update(userId, {
      displayName,
      company,
      jobTitle,
      photoURL
    });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};