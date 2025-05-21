const mongoose = require('mongoose');

const talkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  speakers: [{
    name: {
      type: String,
      required: true
    },
    bio: String,
    photo: String
  }],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  maxAttendees: {
    type: Number,
    default: null // null means unlimited
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Talk', talkSchema);