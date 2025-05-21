const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  talk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Talk',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'waitlisted'],
    default: 'confirmed'
  },
  attended: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only register once for a talk
registrationSchema.index({ user: 1, talk: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);