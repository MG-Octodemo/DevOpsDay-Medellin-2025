const RegistrationStore = require('../../src/store/registrations');

describe('Registration Store - Unit Tests', () => {
  let originalStore;

  beforeEach(() => {
    // Save original store state
    originalStore = { ...RegistrationStore };
    // Clear the store for each test
    RegistrationStore.registrations.clear();
    RegistrationStore.counter = 1;
  });

  afterEach(() => {
    // Restore store state
    RegistrationStore.registrations.clear();
    RegistrationStore.counter = 1;
  });

  describe('create()', () => {
    const validRegistrationData = {
      userId: 'user-123',
      talkId: 'talk-456',
      registrationDate: new Date(),
      status: 'confirmed'
    };

    test('should create registration with valid data', () => {
      const registration = RegistrationStore.create(validRegistrationData);

      expect(registration).toHaveProperty('id');
      expect(registration.userId).toBe(validRegistrationData.userId);
      expect(registration.talkId).toBe(validRegistrationData.talkId);
      expect(registration.status).toBe('confirmed');
      expect(registration).toHaveProperty('createdAt');
      expect(registration).toHaveProperty('updatedAt');
    });

    test('should auto-generate ID for new registration', () => {
      const registration1 = RegistrationStore.create(validRegistrationData);
      const registration2 = RegistrationStore.create({
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

      const registration = RegistrationStore.create(minimalData);

      expect(registration.status).toBe('confirmed');
      expect(registration.attended).toBe(false);
      expect(registration).toHaveProperty('registrationDate');
    });

    test('should prevent duplicate registration for same user and talk', () => {
      // First registration should succeed
      RegistrationStore.create(validRegistrationData);

      // Second registration for same user and talk should fail
      expect(() => {
        RegistrationStore.create(validRegistrationData);
      }).toThrow('User is already registered for this talk');
    });

    // Boundary Value Analysis: Testing edge cases for user and talk IDs
    test('should handle empty string user ID', () => {
      const invalidData = { ...validRegistrationData, userId: '' };
      
      expect(() => {
        RegistrationStore.create(invalidData);
      }).toThrow();
    });

    test('should handle null user ID', () => {
      const invalidData = { ...validRegistrationData, userId: null };
      
      expect(() => {
        RegistrationStore.create(invalidData);
      }).toThrow();
    });

    test('should handle very long user ID', () => {
      const longUserId = 'a'.repeat(1000);
      const validData = { ...validRegistrationData, userId: longUserId };
      
      const registration = RegistrationStore.create(validData);
      expect(registration.userId).toBe(longUserId);
    });
  });

  describe('findById()', () => {
    test('should return registration when found', () => {
      const created = store.create({
        userId: 'user-123',
        talkId: 'talk-456'
      });

      const found = store.findById(created.id);
      expect(found).toEqual(created);
    });

    test('should return null when registration not found', () => {
      const found = store.findById('nonexistent-id');
      expect(found).toBeNull();
    });

    // Boundary Value Analysis: Testing edge cases for ID lookup
    test('should handle empty string ID', () => {
      const found = store.findById('');
      expect(found).toBeNull();
    });

    test('should handle null ID', () => {
      const found = store.findById(null);
      expect(found).toBeNull();
    });

    test('should handle undefined ID', () => {
      const found = store.findById(undefined);
      expect(found).toBeNull();
    });
  });

  describe('findByUserId()', () => {
    beforeEach(() => {
      // Create test registrations
      store.create({ userId: 'user-1', talkId: 'talk-1' });
      store.create({ userId: 'user-1', talkId: 'talk-2' });
      store.create({ userId: 'user-2', talkId: 'talk-1' });
    });

    test('should return all registrations for specific user', () => {
      const userRegistrations = store.findByUserId('user-1');
      
      expect(userRegistrations).toHaveLength(2);
      userRegistrations.forEach(reg => {
        expect(reg.userId).toBe('user-1');
      });
    });

    test('should return empty array for user with no registrations', () => {
      const userRegistrations = store.findByUserId('user-with-no-registrations');
      expect(userRegistrations).toEqual([]);
    });

    test('should handle null user ID', () => {
      const userRegistrations = store.findByUserId(null);
      expect(userRegistrations).toEqual([]);
    });
  });

  describe('findByTalkId()', () => {
    beforeEach(() => {
      // Create test registrations
      store.create({ userId: 'user-1', talkId: 'talk-1' });
      store.create({ userId: 'user-2', talkId: 'talk-1' });
      store.create({ userId: 'user-1', talkId: 'talk-2' });
    });

    test('should return all registrations for specific talk', () => {
      const talkRegistrations = store.findByTalkId('talk-1');
      
      expect(talkRegistrations).toHaveLength(2);
      talkRegistrations.forEach(reg => {
        expect(reg.talkId).toBe('talk-1');
      });
    });

    test('should return empty array for talk with no registrations', () => {
      const talkRegistrations = store.findByTalkId('talk-with-no-registrations');
      expect(talkRegistrations).toEqual([]);
    });

    // Boundary Value Analysis: Capacity management testing
    test('should accurately count registrations for capacity checking', () => {
      // Create multiple registrations for same talk
      const talkId = 'capacity-test-talk';
      const maxRegistrations = 100;

      for (let i = 1; i <= maxRegistrations; i++) {
        store.create({ userId: `user-${i}`, talkId: talkId });
      }

      const registrations = store.findByTalkId(talkId);
      expect(registrations).toHaveLength(maxRegistrations);
    });
  });

  describe('findByUserAndTalk()', () => {
    beforeEach(() => {
      store.create({ userId: 'user-1', talkId: 'talk-1' });
      store.create({ userId: 'user-1', talkId: 'talk-2' });
      store.create({ userId: 'user-2', talkId: 'talk-1' });
    });

    test('should return specific registration for user and talk', () => {
      const registration = store.findByUserAndTalk('user-1', 'talk-1');
      
      expect(registration).toBeDefined();
      expect(registration.userId).toBe('user-1');
      expect(registration.talkId).toBe('talk-1');
    });

    test('should return null when no matching registration found', () => {
      const registration = store.findByUserAndTalk('user-1', 'nonexistent-talk');
      expect(registration).toBeNull();
    });

    test('should handle null parameters', () => {
      const registration1 = store.findByUserAndTalk(null, 'talk-1');
      const registration2 = store.findByUserAndTalk('user-1', null);
      const registration3 = store.findByUserAndTalk(null, null);
      
      expect(registration1).toBeNull();
      expect(registration2).toBeNull();
      expect(registration3).toBeNull();
    });
  });

  describe('update()', () => {
    let registrationId;

    beforeEach(() => {
      const registration = store.create({
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

      const updated = store.update(registrationId, updates);
      
      expect(updated).toBeDefined();
      expect(updated.status).toBe('attended');
      expect(updated.attended).toBe(true);
      expect(updated).toHaveProperty('updatedAt');
    });

    test('should return null when updating non-existent registration', () => {
      const updated = store.update('nonexistent-id', { status: 'attended' });
      expect(updated).toBeNull();
    });

    test('should preserve original data for fields not being updated', () => {
      const original = store.findById(registrationId);
      const updates = { status: 'attended' };

      const updated = store.update(registrationId, updates);
      
      expect(updated.userId).toBe(original.userId);
      expect(updated.talkId).toBe(original.talkId);
      expect(updated.registrationDate).toEqual(original.registrationDate);
    });
  });

  describe('delete()', () => {
    let registrationId;

    beforeEach(() => {
      const registration = store.create({
        userId: 'user-123',
        talkId: 'talk-456'
      });
      registrationId = registration.id;
    });

    test('should delete existing registration', () => {
      const result = store.delete(registrationId);
      expect(result).toBe(true);

      // Verify registration is deleted
      const found = store.findById(registrationId);
      expect(found).toBeNull();
    });

    test('should return false when deleting non-existent registration', () => {
      const result = store.delete('nonexistent-id');
      expect(result).toBe(false);
    });

    test('should handle null ID gracefully', () => {
      const result = store.delete(null);
      expect(result).toBe(false);
    });
  });

  describe('findAll()', () => {
    test('should return empty array when no registrations exist', () => {
      const all = store.findAll();
      expect(all).toEqual([]);
    });

    test('should return all registrations', () => {
      // Create multiple registrations
      store.create({ userId: 'user-1', talkId: 'talk-1' });
      store.create({ userId: 'user-2', talkId: 'talk-2' });
      store.create({ userId: 'user-3', talkId: 'talk-3' });

      const all = store.findAll();
      expect(all).toHaveLength(3);
    });

    // Boundary Value Analysis: Testing large datasets
    test('should handle large number of registrations efficiently', () => {
      const largeNumber = 1000;
      
      // Create many registrations
      for (let i = 1; i <= largeNumber; i++) {
        store.create({ userId: `user-${i}`, talkId: `talk-${i % 10}` });
      }

      const startTime = Date.now();
      const all = store.findAll();
      const endTime = Date.now();

      expect(all).toHaveLength(largeNumber);
      // Should complete within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('cancel()', () => {
    let registrationId;

    beforeEach(() => {
      const registration = store.create({
        userId: 'user-123',
        talkId: 'talk-456',
        status: 'confirmed'
      });
      registrationId = registration.id;
    });

    test('should cancel registration by updating status', () => {
      const result = store.cancel(registrationId);
      expect(result).toBe(true);

      const cancelled = store.findById(registrationId);
      expect(cancelled.status).toBe('cancelled');
    });

    test('should return false when cancelling non-existent registration', () => {
      const result = store.cancel('nonexistent-id');
      expect(result).toBe(false);
    });
  });

  describe('Concurrency and Data Integrity', () => {
    test('should maintain data integrity under concurrent operations', () => {
      const userId = 'concurrent-user';
      const talkId = 'concurrent-talk';

      // Simulate concurrent registration attempts
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < 10; i++) {
        try {
          store.create({ userId: `${userId}-${i}`, talkId });
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      // All should succeed since different users
      expect(successCount).toBe(10);
      expect(errorCount).toBe(0);

      // But duplicate for same user should fail
      store.create({ userId: 'duplicate-test', talkId });
      
      expect(() => {
        store.create({ userId: 'duplicate-test', talkId });
      }).toThrow('User is already registered for this talk');
    });
  });
});