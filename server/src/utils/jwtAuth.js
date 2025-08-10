const jwt = require('jsonwebtoken');
const usersStore = require('../store/users');

// Secret key for JWT - require it to be set in production
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  console.warn('Warning: JWT_SECRET not set. Using default for development only.');
}

// Generate JWT token for a user
exports.generateToken = (user) => {
  if (!user || !user.id || !user.email) {
    throw new Error('Invalid user object for token generation');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user'
  };

  // Token expires in 24 hours
  const secret = JWT_SECRET || 'devopsdaymedellin2025secret';
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    if (!token) {
      return null;
    }
    const secret = JWT_SECRET || 'devopsdaymedellin2025secret';
    return jwt.verify(token, secret);
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    if (process.env.NODE_ENV !== 'production') {
      console.error('JWT verification error:', error.message);
    }
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
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required',
        statusCode: 401,
        timestamp: new Date().toISOString()
      });
    }
    const token = authHeader.split(' ')[1];
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        statusCode: 401,
        timestamp: new Date().toISOString()
      });
    }
    // Find user in our store
    let user = usersStore.findById(decoded.id);
    if (!user) {
      // Auto-create user if not found (for 3rd-party JWTs)
      user = await usersStore.create({
        id: decoded.id,
        email: decoded.email,
        displayName: decoded.displayName || decoded.name || '',
        role: decoded.role || 'user'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      statusCode: 401,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && { details: error.message })
    });
  }
};

/**
 * Middleware to check if user has admin role
 * Must be used after authenticate middleware
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      statusCode: 401,
      timestamp: new Date().toISOString()
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      statusCode: 403,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};