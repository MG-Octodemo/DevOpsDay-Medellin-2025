// Import the singleton store instance
const registrationsStore = require('../../src/store/registrations');

describe('Registration Store - Unit Tests', () => {
  beforeEach(() => {
    // Clear the store for each test
    registrationsStore.registrations.clear();
    registrationsStore.counter = 1;
  });

  describe('create() - Functional Suitability Testing', () => {
    const validRegistrationData = {
      userId: 'user-123',
      talkId: 'talk-456',
      registrationDate: new Date(),
      status: 'confirmed'
    };

    test('should create registration with valid data', () => {
      const registration = registrationsStore.create(validRegistrationData);

      expect(registration).toHaveProperty('id');
      expect(registration.userId).toBe(validRegistrationData.userId);
      expect(registration.talkId).toBe(validRegistrationData.talkId);
      expect(registration.status).toBe('confirmed');
      expect(registration).toHaveProperty('createdAt');
      expect(registration).toHaveProperty('updatedAt');
    });

    test('should auto-generate unique IDs', () => {
      const registration1 = registrationsStore.create(validRegistrationData);
      const registration2 = registrationsStore.create({
        ...validRegistrationData,
        userId: 'user-789'
      });

      expect(registration1.id).toBeDefined();
      expect(registration2.id).toBeDefined();
      expect(registration1.id).not.toBe(registration2.id);
    });

    test('should set default values for missing optional fields', () => {
      const minimalData = {
        userId: 'user-123',
        talkId: 'talk-456'
      };

      const registration = registrationsStore.create(minimalData);

      expect(registration.status).toBe('confirmed');
      expect(registration.attended).toBe(false);
      expect(registration).toHaveProperty('registrationDate');
    });

    test('should prevent duplicate registration for same user and talk - Business Rule Testing', () => {
      // First registration should succeed
      registrationsStore.create(validRegistrationData);

      // Second registration for same user and talk should fail
      expect(() => {
        registrationsStore.create(validRegistrationData);
      }).toThrow('User is already registered for this talk');
    });
  });

  describe('findById() - Boundary Value Analysis', () => {
    test('should return registration when found', () => {
      const created = registrationsStore.create({
        userId: 'user-123',
        talkId: 'talk-456'
      });

      const found = registrationsStore.findById(created.id);
      expect(found).toEqual(created);
    });

    test('should return null when registration not found', () => {
      const found = registrationsStore.findById('nonexistent-id');
      expect(found).toBeNull();
    });

    test('should handle edge cases gracefully', () => {
      expect(registrationsStore.findById('')).toBeNull();
      expect(registrationsStore.findById(null)).toBeNull();
      expect(registrationsStore.findById(undefined)).toBeNull();
    });
  });

  describe('findByUserId() - Equivalence Partitioning', () => {
    beforeEach(() => {
      // Create test registrations
      registrationsStore.create({ userId: 'user-1', talkId: 'talk-1' });
      registrationsStore.create({ userId: 'user-1', talkId: 'talk-2' });
      registrationsStore.create({ userId: 'user-2', talkId: 'talk-1' });
    });

    test('should return all registrations for specific user', () => {
      const userRegistrations = registrationsStore.findByUserId('user-1');
      
      expect(userRegistrations).toHaveLength(2);
      userRegistrations.forEach(reg => {
        expect(reg.userId).toBe('user-1');
      });
    });

    test('should return empty array for user with no registrations', () => {
      const userRegistrations = registrationsStore.findByUserId('user-with-no-registrations');
      expect(userRegistrations).toEqual([]);
    });

    test('should handle null user ID', () => {
      const userRegistrations = registrationsStore.findByUserId(null);
      expect(userRegistrations).toEqual([]);
    });
  });

  describe('findByTalkId() - Capacity Management Testing', () => {
    beforeEach(() => {
      // Create test registrations
      registrationsStore.create({ userId: 'user-1', talkId: 'talk-1' });
      registrationsStore.create({ userId: 'user-2', talkId: 'talk-1' });
      registrationsStore.create({ userId: 'user-1', talkId: 'talk-2' });
    });

    test('should return all registrations for specific talk', () => {
      const talkRegistrations = registrationsStore.findByTalkId('talk-1');
      
      expect(talkRegistrations).toHaveLength(2);
      talkRegistrations.forEach(reg => {
        expect(reg.talkId).toBe('talk-1');
      });
    });

    test('should return empty array for talk with no registrations', () => {
      const talkRegistrations = registrationsStore.findByTalkId('talk-with-no-registrations');
      expect(talkRegistrations).toEqual([]);
    });

    // Boundary Value Analysis: Capacity management testing
    test('should accurately count registrations for capacity checking', () => {
      const talkId = 'capacity-test-talk';
      const registrationCount = 50;

      for (let i = 1; i <= registrationCount; i++) {
        registrationsStore.create({ userId: `user-${i}`, talkId: talkId });
      }

      const registrations = registrationsStore.findByTalkId(talkId);
      expect(registrations).toHaveLength(registrationCount);
    });
  });

  describe('findByUserAndTalk() - Decision Table Testing', () => {
    beforeEach(() => {
      registrationsStore.create({ userId: 'user-1', talkId: 'talk-1' });
      registrationsStore.create({ userId: 'user-1', talkId: 'talk-2' });
      registrationsStore.create({ userId: 'user-2', talkId: 'talk-1' });
    });

    test('should return specific registration for user and talk', () => {
      const registration = registrationsStore.findByUserAndTalk('user-1', 'talk-1');
      
      expect(registration).toBeDefined();
      expect(registration.userId).toBe('user-1');
      expect(registration.talkId).toBe('talk-1');
    });

    test('should return null when no matching registration found', () => {
      const registration = registrationsStore.findByUserAndTalk('user-1', 'nonexistent-talk');
      expect(registration).toBeNull();
    });

    test('should handle null parameters', () => {
      expect(registrationsStore.findByUserAndTalk(null, 'talk-1')).toBeNull();
      expect(registrationsStore.findByUserAndTalk('user-1', null)).toBeNull();
      expect(registrationsStore.findByUserAndTalk(null, null)).toBeNull();
    });
  });

  describe('update() - State Transition Testing', () => {
    let registrationId;

    beforeEach(() => {
      const registration = registrationsStore.create({
        userId: 'user-123',
        talkId: 'talk-456',
        status: 'confirmed'
      });
      registrationId = registration.id;
    });

    test('should update registration with valid data', () => {
      const updates = {
        status: 'attended',
        attended: true
      };

      const updated = registrationsStore.update(registrationId, updates);
      
      expect(updated).toBeDefined();
      expect(updated.status).toBe('attended');
      expect(updated.attended).toBe(true);
      expect(updated).toHaveProperty('updatedAt');
    });

    test('should return null when updating non-existent registration', () => {
      const updated = registrationsStore.update('nonexistent-id', { status: 'attended' });
      expect(updated).toBeNull();
    });

    test('should preserve original data for fields not being updated', () => {
      const original = registrationsStore.findById(registrationId);
      const updates = { status: 'attended' };

      const updated = registrationsStore.update(registrationId, updates);
      
      expect(updated.userId).toBe(original.userId);
      expect(updated.talkId).toBe(original.talkId);
      expect(updated.registrationDate).toEqual(original.registrationDate);
    });
  });

  describe('delete() - Reliability Testing', () => {
    let registrationId;

    beforeEach(() => {
      const registration = registrationsStore.create({
        userId: 'user-123',
        talkId: 'talk-456'
      });
      registrationId = registration.id;
    });

    test('should delete existing registration', () => {
      const result = registrationsStore.delete(registrationId);
      expect(result).toBe(true);

      // Verify registration is deleted
      const found = registrationsStore.findById(registrationId);
      expect(found).toBeNull();
    });

    test('should return false when deleting non-existent registration', () => {
      const result = registrationsStore.delete('nonexistent-id');
      expect(result).toBe(false);
    });

    test('should handle null ID gracefully', () => {
      const result = registrationsStore.delete(null);
      expect(result).toBe(false);
    });
  });

  describe('Performance Testing - ISO 25010 Performance Efficiency', () => {
    test('should handle large number of registrations efficiently', () => {
      const largeNumber = 1000;
      
      // Create many registrations
      const startTime = Date.now();
      for (let i = 1; i <= largeNumber; i++) {
        registrationsStore.create({ userId: `user-${i}`, talkId: `talk-${i % 10}` });
      }
      const createEndTime = Date.now();

      const all = registrationsStore.findAll();
      const findEndTime = Date.now();

      expect(all).toHaveLength(largeNumber);
      
      // Creation should complete within reasonable time (less than 1000ms)
      expect(createEndTime - startTime).toBeLessThan(1000);
      
      // Retrieval should be fast (less than 100ms)
      expect(findEndTime - createEndTime).toBeLessThan(100);
    });

    test('should perform search operations efficiently', () => {
      // Create test data with unique combinations
      for (let i = 1; i <= 100; i++) {
        registrationsStore.create({ 
          userId: `search-user-${i}`, 
          talkId: `search-talk-${i}` 
        });
      }

      const startTime = Date.now();
      
      // Perform multiple search operations
      registrationsStore.findByUserId('search-user-1');
      registrationsStore.findByTalkId('search-talk-1');
      registrationsStore.findByUserAndTalk('search-user-1', 'search-talk-1');
      
      const endTime = Date.now();
      
      // All searches should complete quickly
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('Concurrency and Data Integrity Testing', () => {
    test('should maintain data integrity under concurrent operations', () => {
      const userId = 'concurrent-user';
      const talkId = 'concurrent-talk';

      // Simulate concurrent registration attempts for different users
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < 10; i++) {
        try {
          registrationsStore.create({ userId: `${userId}-${i}`, talkId });
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      // All should succeed since different users
      expect(successCount).toBe(10);
      expect(errorCount).toBe(0);

      // But duplicate for same user should fail
      registrationsStore.create({ userId: 'duplicate-test', talkId });
      
      expect(() => {
        registrationsStore.create({ userId: 'duplicate-test', talkId });
      }).toThrow('User is already registered for this talk');
    });
  });
});