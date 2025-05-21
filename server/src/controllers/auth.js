const admin = require('firebase-admin');
const User = require('../models/user');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
}

// Verify Firebase token
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Check if user exists in our database
    let user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      // Create user in our database if not exists
      user = new User({
        firebaseUid: userId,
        email: decodedToken.email,
        displayName: decodedToken.name || '',
      });
      await user.save();
    }

    res.status(200).json({ message: 'Token verified', user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // Extract user ID from authenticated request
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        displayName: req.body.displayName,
        // Add other updateable fields
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};