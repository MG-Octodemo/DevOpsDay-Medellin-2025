const bcrypt = require('bcryptjs');

// In-memory database for users
const users = [];

// Function to create a new user
const createUser = async (username, password) => {
  // Check if username already exists
  if (users.find(user => user.username === username)) {
    throw new Error('Username already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    registeredTalks: []
  };

  // Add user to database
  users.push(newUser);

  return {
    id: newUser.id,
    username: newUser.username,
    registeredTalks: newUser.registeredTalks
  };
};

// Function to get a user by username
const getUserByUsername = (username) => {
  return users.find(user => user.username === username);
};

// Function to get a user by ID
const getUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

// Function to validate user credentials
const validateUser = async (username, password) => {
  const user = getUserByUsername(username);
  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    registeredTalks: user.registeredTalks
  };
};

// Function to register user to a talk
const registerUserToTalk = (userId, talkId) => {
  const user = getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if user is already registered to this talk
  if (user.registeredTalks.includes(talkId)) {
    throw new Error('User already registered to this talk');
  }

  // Add talk to user's registered talks
  user.registeredTalks.push(talkId);

  return {
    id: user.id,
    username: user.username,
    registeredTalks: user.registeredTalks
  };
};

// Function to get user's registered talks
const getUserRegisteredTalks = (userId) => {
  const user = getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return user.registeredTalks;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  validateUser,
  registerUserToTalk,
  getUserRegisteredTalks
};
