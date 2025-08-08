const admin = require('firebase-admin');
const User = require('../models/user');

/**
 * Middleware to authenticate requests using Firebase token
 * Attaches user to request object if authentication is successful
 */
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find user in our database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
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