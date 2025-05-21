const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    trim: true
  },
  photoURL: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  company: String,
  jobTitle: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);