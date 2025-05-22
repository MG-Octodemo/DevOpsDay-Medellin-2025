const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// In-memory store for users
class UserStore {
  constructor() {
    this.users = new Map();
    this.counter = 1;
  }

  // Generate unique ID
  generateId() {
    return (this.counter++).toString();
  }

  // Create a new user
  async create(userData) {
    const id = this.generateId();
    const timestamp = new Date();
    
    // Hash password if it exists
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const user = {
      id,
      ...userData,
      role: userData.role || 'user',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.users.set(id, user);
    return { ...user, password: undefined }; // Don't return password
  }

  // Find a user by ID
  findById(id) {
    const user = this.users.get(id);
    if (!user) return null;
    
    // Don't return password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Find a user by email
  findByEmail(email) {
    for (const [_, user] of this.users) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user; // Return with password for authentication
      }
    }
    return null;
  }

  // Update a user
  async update(id, updates) {
    const user = this.users.get(id);
    if (!user) return null;

    // Hash password if it's being updated
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    
    // Don't return password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // Delete a user
  delete(id) {
    if (!this.users.has(id)) return false;
    return this.users.delete(id);
  }

  // Get all users (for admin purposes)
  findAll() {
    const allUsers = [];
    for (const [_, user] of this.users) {
      const { password, ...userWithoutPassword } = user;
      allUsers.push(userWithoutPassword);
    }
    return allUsers;
  }

  // Verify password
  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }
}

// Create and export a singleton instance
const usersStore = new UserStore();

module.exports = usersStore;