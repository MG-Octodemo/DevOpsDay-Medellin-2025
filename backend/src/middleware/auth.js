const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'devopsdaymedellin2025secret';

// Middleware to authenticate JWT token
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload to request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  auth,
  generateToken,
  JWT_SECRET
};
