const request = require('supertest');
const app = require('../../src/index');

// Mock authentication middleware for testing
jest.mock('../../src/utils/auth', () => ({
  authenticate: (req, res, next) => {
    req.user = {
      id: 'test-user-123',
      displayName: 'Test User',
      email: 'test@example.com'
    };
    next();
  },
  isAdmin: (req, res, next) => {
    req.user.role = 'admin';
    next();
  }
}));

describe('Registration Controller - Unit Tests', () => {
  let testTalkId;

  beforeAll(async () => {
    // Create a test talk for registration tests
    const talkResponse = await request(app)
      .post('/api/talks')
      .send({
        title: 'Test Registration Talk',
        description: 'A talk for testing registrations',
        speakers: [{ name: 'Test Speaker', bio: 'Bio', photo: '' }],
        startTime: new Date(Date.now() + 86400000),
        endTime: new Date(Date.now() + 90000000),
        location: 'Test Room',
        maxAttendees: 2, // Small capacity for boundary testing
        tags: ['Testing']
      });
    testTalkId = talkResponse.body.id;
  });

  describe('POST /api/registration/:talkId', () => {
    // State Transition Testing: User registration workflow
    test('should successfully register user for available talk', async () => {
      const response = await request(app)
        .post(`/api/registration/${testTalkId}`)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.talkId).toBe(testTalkId);
      expect(response.body.userId).toBe('test-user-123');
      expect(response.body.status).toBe('confirmed');
    });

    test('should prevent duplicate registration for same user and talk', async () => {
      // This should fail since user is already registered (from previous test)
      const response = await request(app)
        .post(`/api/registration/${testTalkId}`)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already registered');
    });

    test('should return 404 for non-existent talk', async () => {
      const response = await request(app)
        .post('/api/registration/nonexistent-talk')
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
    });

    // Boundary Value Analysis: Testing capacity limits
    test('should handle capacity limits correctly', async () => {
      // Create another test talk with capacity of 1
      const limitedTalkResponse = await request(app)
        .post('/api/talks')
        .send({
          title: 'Limited Capacity Talk',
          description: 'Talk with capacity of 1',
          speakers: [{ name: 'Speaker', bio: 'Bio', photo: '' }],
          startTime: new Date(Date.now() + 86400000),
          endTime: new Date(Date.now() + 90000000),
          location: 'Small Room',
          maxAttendees: 1,
          tags: ['Limited']
        });

      const limitedTalkId = limitedTalkResponse.body.id;

      // First registration should succeed
      const firstRegistration = await request(app)
        .post(`/api/registration/${limitedTalkId}`)
        .expect(201);

      expect(firstRegistration.body.status).toBe('confirmed');

      // Mock different user for second registration
      jest.resetModules();
      jest.doMock('../../src/utils/auth', () => ({
        authenticate: (req, res, next) => {
          req.user = {
            id: 'test-user-456',
            displayName: 'Second Test User',
            email: 'test2@example.com'
          };
          next();
        }
      }));

      // Second registration should fail due to capacity
      const secondRegistration = await request(app)
        .post(`/api/registration/${limitedTalkId}`)
        .expect(400);

      expect(secondRegistration.body).toHaveProperty('message');
      expect(secondRegistration.body.message).toContain('full');
    });
  });

  describe('DELETE /api/registration/:talkId', () => {
    test('should successfully cancel existing registration', async () => {
      // First ensure user is registered
      const registrationResponse = await request(app)
        .post(`/api/registration/${testTalkId}`)
        .expect(201);

      // Then cancel the registration
      const response = await request(app)
        .delete(`/api/registration/${testTalkId}`)
        .expect(200);

      expect(response.body.message).toBe('Registration cancelled successfully');
    });

    test('should return 404 when cancelling non-existent registration', async () => {
      const response = await request(app)
        .delete(`/api/registration/${testTalkId}`)
        .expect(404);

      expect(response.body.message).toBe('Registration not found');
    });

    test('should return 404 for non-existent talk', async () => {
      const response = await request(app)
        .delete('/api/registration/nonexistent-talk')
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
    });
  });

  describe('GET /api/registration/user', () => {
    beforeEach(async () => {
      // Reset auth mock to original test user
      jest.resetModules();
      jest.doMock('../../src/utils/auth', () => ({
        authenticate: (req, res, next) => {
          req.user = {
            id: 'test-user-123',
            displayName: 'Test User',
            email: 'test@example.com'
          };
          next();
        }
      }));
    });

    test('should return user registrations with talk details', async () => {
      // First register for a talk
      await request(app)
        .post(`/api/registration/${testTalkId}`)
        .expect(201);

      // Then get user registrations
      const response = await request(app)
        .get('/api/registration/user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const registration = response.body[0];
      expect(registration).toHaveProperty('id');
      expect(registration).toHaveProperty('talkId');
      expect(registration).toHaveProperty('talk');
      expect(registration.talk).toHaveProperty('title');
    });

    test('should return empty array for user with no registrations', async () => {
      // Mock a different user with no registrations
      jest.resetModules();
      jest.doMock('../../src/utils/auth', () => ({
        authenticate: (req, res, next) => {
          req.user = {
            id: 'user-with-no-registrations',
            displayName: 'No Registrations User',
            email: 'noreg@example.com'
          };
          next();
        }
      }));

      const response = await request(app)
        .get('/api/registration/user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('should sort registrations by talk start time', async () => {
      // Create multiple talks with different start times
      const earlyTalkResponse = await request(app)
        .post('/api/talks')
        .send({
          title: 'Early Talk',
          description: 'An early talk',
          speakers: [{ name: 'Speaker', bio: 'Bio', photo: '' }],
          startTime: new Date(Date.now() + 3600000), // 1 hour from now
          endTime: new Date(Date.now() + 7200000),   // 2 hours from now
          location: 'Room A',
          maxAttendees: 50,
          tags: ['Early']
        });

      const lateTalkResponse = await request(app)
        .post('/api/talks')
        .send({
          title: 'Late Talk',
          description: 'A late talk',
          speakers: [{ name: 'Speaker', bio: 'Bio', photo: '' }],
          startTime: new Date(Date.now() + 172800000), // 2 days from now
          endTime: new Date(Date.now() + 176400000),   // 2 days + 1 hour from now
          location: 'Room B',
          maxAttendees: 50,
          tags: ['Late']
        });

      // Register for both talks
      await request(app).post(`/api/registration/${lateTalkResponse.body.id}`);
      await request(app).post(`/api/registration/${earlyTalkResponse.body.id}`);

      // Get registrations and verify sorting
      const response = await request(app)
        .get('/api/registration/user')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(2);
      
      // Check that talks are sorted by start time (earliest first)
      for (let i = 0; i < response.body.length - 1; i++) {
        const currentStart = new Date(response.body[i].talk.startTime);
        const nextStart = new Date(response.body[i + 1].talk.startTime);
        expect(currentStart.getTime()).toBeLessThanOrEqual(nextStart.getTime());
      }
    });
  });

  describe('GET /api/registration/talk/:talkId', () => {
    test('should return registrations for specific talk', async () => {
      // Ensure there's at least one registration
      await request(app)
        .post(`/api/registration/${testTalkId}`)
        .expect(201);

      const response = await request(app)
        .get(`/api/registration/talk/${testTalkId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const registration = response.body[0];
      expect(registration).toHaveProperty('id');
      expect(registration).toHaveProperty('talkId', testTalkId);
      expect(registration).toHaveProperty('user');
      expect(registration.user).toHaveProperty('displayName');
      expect(registration.user).toHaveProperty('email');
    });

    test('should return 404 for non-existent talk', async () => {
      const response = await request(app)
        .get('/api/registration/talk/nonexistent-talk')
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
    });

    test('should return empty array for talk with no registrations', async () => {
      // Create a new talk with no registrations
      const emptyTalkResponse = await request(app)
        .post('/api/talks')
        .send({
          title: 'Empty Talk',
          description: 'Talk with no registrations',
          speakers: [{ name: 'Speaker', bio: 'Bio', photo: '' }],
          startTime: new Date(Date.now() + 86400000),
          endTime: new Date(Date.now() + 90000000),
          location: 'Empty Room',
          maxAttendees: 50,
          tags: ['Empty']
        });

      const response = await request(app)
        .get(`/api/registration/talk/${emptyTalkResponse.body.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('should not expose sensitive user information', async () => {
      // Ensure there's a registration
      await request(app)
        .post(`/api/registration/${testTalkId}`)
        .expect(201);

      const response = await request(app)
        .get(`/api/registration/talk/${testTalkId}`)
        .expect(200);

      const registration = response.body[0];
      expect(registration.user).toHaveProperty('displayName');
      expect(registration.user).toHaveProperty('email');
      // Sensitive fields should not be exposed
      expect(registration.user).not.toHaveProperty('password');
      expect(registration.user).not.toHaveProperty('passwordHash');
    });
  });

  // Decision Table Testing: Registration business rules
  describe('Registration Business Rules', () => {
    test('should apply correct business rules for registration scenarios', async () => {
      const scenarios = [
        {
          description: 'authenticated user + available talk + not registered = success',
          authenticated: true,
          talkExists: true,
          talkHasCapacity: true,
          userAlreadyRegistered: false,
          expectedStatus: 201
        },
        {
          description: 'authenticated user + available talk + already registered = failure',
          authenticated: true,
          talkExists: true,
          talkHasCapacity: true,
          userAlreadyRegistered: true,
          expectedStatus: 400
        },
        {
          description: 'authenticated user + non-existent talk = failure',
          authenticated: true,
          talkExists: false,
          talkHasCapacity: false,
          userAlreadyRegistered: false,
          expectedStatus: 404
        }
      ];

      for (const scenario of scenarios) {
        if (scenario.talkExists) {
          // Use existing test talk
          if (scenario.userAlreadyRegistered) {
            // Register user first
            await request(app).post(`/api/registration/${testTalkId}`);
          }
          
          const response = await request(app)
            .post(`/api/registration/${testTalkId}`);
          
          expect(response.status).toBe(scenario.expectedStatus);
        } else {
          // Use non-existent talk
          const response = await request(app)
            .post('/api/registration/nonexistent-talk');
          
          expect(response.status).toBe(scenario.expectedStatus);
        }
      }
    });
  });
});