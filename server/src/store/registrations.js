// In-memory store for registrations
class RegistrationStore {
  constructor() {
    this.registrations = new Map();
    this.counter = 1;
  }

  // Generate unique ID
  generateId() {
    return (this.counter++).toString();
  }

  // Create a new registration
  create(registrationData) {
    const id = this.generateId();
    const timestamp = new Date();
    
    // Check if user is already registered for this talk
    const existingRegistration = this.findByUserAndTalk(
      registrationData.userId,
      registrationData.talkId
    );
    
    if (existingRegistration) {
      throw new Error('User is already registered for this talk');
    }
    
    const registration = {
      id,
      ...registrationData,
      registrationDate: registrationData.registrationDate || timestamp,
      status: registrationData.status || 'confirmed',
      attended: registrationData.attended || false,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.registrations.set(id, registration);
    return registration;
  }

  // Find a registration by ID
  findById(id) {
    return this.registrations.get(id) || null;
  }

  // Find registrations by user ID
  findByUserId(userId) {
    const results = [];
    for (const registration of this.registrations.values()) {
      if (registration.userId === userId) {
        results.push(registration);
      }
    }
    return results;
  }

  // Find registrations by talk ID
  findByTalkId(talkId) {
    const results = [];
    for (const registration of this.registrations.values()) {
      if (registration.talkId === talkId) {
        results.push(registration);
      }
    }
    return results;
  }

  // Find a specific registration by user and talk
  findByUserAndTalk(userId, talkId) {
    for (const registration of this.registrations.values()) {
      if (registration.userId === userId && registration.talkId === talkId) {
        return registration;
      }
    }
    return null;
  }

  // Update a registration
  update(id, updates) {
    const registration = this.registrations.get(id);
    if (!registration) return null;

    const updatedRegistration = {
      ...registration,
      ...updates,
      updatedAt: new Date()
    };

    this.registrations.set(id, updatedRegistration);
    return updatedRegistration;
  }

  // Delete a registration
  delete(id) {
    if (!this.registrations.has(id)) return false;
    return this.registrations.delete(id);
  }

  // Cancel a registration
  cancel(id) {
    const registration = this.registrations.get(id);
    if (!registration) return null;

    registration.status = 'cancelled';
    registration.updatedAt = new Date();
    
    this.registrations.set(id, registration);
    return registration;
  }

  // Get all registrations
  findAll() {
    return Array.from(this.registrations.values());
  }

  // Find registrations by query (simple filtering)
  find(query = {}) {
    const results = [];
    for (const registration of this.registrations.values()) {
      let match = true;
      
      // Check if all query conditions match
      for (const [key, value] of Object.entries(query)) {
        if (registration[key] !== value) {
          match = false;
          break;
        }
      }
      
      if (match) {
        results.push(registration);
      }
    }
    
    return results;
  }
}

// Create and export a singleton instance
const registrationsStore = new RegistrationStore();

module.exports = registrationsStore;