const jwt = require('jsonwebtoken');
const usersStore = require('../store/users');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'devopsdaymedellin2025secret';

// Generate JWT token for a user
exports.generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  // Token expires in 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to authenticate requests using JWT token
 * Attaches user to request object if authentication is successful
 */
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = this.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // Find user in our store
    const user = usersStore.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

/**
 * Middleware to check if user has admin role
 * Must be used after authenticate middleware
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};