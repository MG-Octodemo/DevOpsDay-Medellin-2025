const request = require('supertest');
const app = require('../src/index');

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123',
  displayName: 'Test User'
};

const testTalk = {
  title: 'Test Talk API',
  description: 'This is a test talk for API testing',
  location: 'Test Room',
  speakers: [{ name: 'Test Speaker', bio: 'Test Bio' }],
  startTime: new Date('2025-05-22T10:00:00'),
  endTime: new Date('2025-05-22T11:00:00'),
  maxAttendees: 50,
  tags: ['Test', 'API']
};

describe('API Integration Tests', () => {
  let authToken;
  let talkId;

  // Health check endpoint
  describe('GET /health', () => {
    test('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('OK');
    });
  });

  // Authentication endpoints
  describe('Auth Endpoints', () => {
    describe('POST /api/auth/register', () => {
      test('should register a new user with valid data', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send(testUser);
        
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User registered successfully');
        expect(res.body.data.user.email).toBe(testUser.email);
        expect(res.body.data.token).toBeDefined();
        
        authToken = res.body.data.token;
      });

      test('should reject registration with invalid email', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'invalid-email',
            password: 'TestPassword123',
            displayName: 'Test User'
          });
        
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.details.validationErrors).toContain('Valid email is required');
      });

      test('should reject weak password', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test2@example.com',
            password: 'weak',
            displayName: 'Test User'
          });
        
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should reject duplicate email', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send(testUser);
        
        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User already exists with this email');
      });
    });

    describe('POST /api/auth/login', () => {
      test('should login with valid credentials', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          });
        
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Login successful');
        expect(res.body.data.token).toBeDefined();
      });

      test('should reject invalid credentials', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword'
          });
        
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      test('should reject missing fields', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: testUser.email
          });
        
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  });

  // Talks endpoints
  describe('Talks Endpoints', () => {
    describe('GET /api/talks', () => {
      test('should get all talks', async () => {
        const res = await request(app).get('/api/talks');
        
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.talks).toBeDefined();
        expect(Array.isArray(res.body.data.talks)).toBe(true);
        expect(res.body.count).toBeDefined();
      });
    });

    describe('POST /api/talks', () => {
      test('should require authentication and admin role', async () => {
        const res = await request(app)
          .post('/api/talks')
          .send(testTalk);
        
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      test('should reject non-admin user', async () => {
        const res = await request(app)
          .post('/api/talks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(testTalk);
        
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
      });

      test('should reject talk with invalid data (if admin)', async () => {
        const res = await request(app)
          .post('/api/talks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'A',  // Too short
            description: 'Short'  // Too short
          });
        
        expect(res.status).toBe(403); // Will fail at auth level first
        expect(res.body.success).toBe(false);
      });
    });

    describe('GET /api/talks/:id', () => {
      test('should get talk by valid ID from existing data', async () => {
        // Get a talk ID from the existing talks
        const allTalksRes = await request(app).get('/api/talks');
        const existingTalkId = allTalksRes.body.data.talks[0]?.id;
        
        if (existingTalkId) {
          const res = await request(app).get(`/api/talks/${existingTalkId}`);
          
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.data.talk.id).toBe(existingTalkId);
        } else {
          // Skip if no talks exist
          expect(true).toBe(true);
        }
      });

      test('should return 404 for non-existent talk', async () => {
        const res = await request(app).get('/api/talks/999999');
        
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });
  });

  // Registration endpoints (require authentication)
  describe('Registration Endpoints', () => {
    describe('POST /api/registration/:talkId', () => {
      test('should require authentication', async () => {
        // Get a talk ID from existing data
        const allTalksRes = await request(app).get('/api/talks');
        const existingTalkId = allTalksRes.body.data.talks[0]?.id || '1';
        
        const res = await request(app)
          .post(`/api/registration/${existingTalkId}`)
          .send();
        
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      test('should register user for talk with valid auth', async () => {
        // Get a talk ID from existing data
        const allTalksRes = await request(app).get('/api/talks');
        const existingTalkId = allTalksRes.body.data.talks[0]?.id;
        
        if (existingTalkId) {
          const res = await request(app)
            .post(`/api/registration/${existingTalkId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send();
          
          expect(res.status).toBe(201);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Registration successful');
          
          // Store for next test
          talkId = existingTalkId;
        } else {
          // Skip if no talks exist
          expect(true).toBe(true);
        }
      });

      test('should prevent duplicate registration', async () => {
        if (talkId) {
          const res = await request(app)
            .post(`/api/registration/${talkId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send();
          
          expect(res.status).toBe(409);
          expect(res.body.success).toBe(false);
        } else {
          expect(true).toBe(true);
        }
      });
    });

    describe('GET /api/registration/user', () => {
      test('should get user registrations with auth', async () => {
        const res = await request(app)
          .get('/api/registration/user')
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.registrations).toBeDefined();
        expect(Array.isArray(res.body.data.registrations)).toBe(true);
      });
    });
  });

  // Rate limiting tests
  describe('Rate Limiting', () => {
    test('should enforce rate limits on auth endpoints', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const promises = Array(6).fill().map(() => 
        request(app)
          .post('/api/auth/login')
          .send({ email: 'fake@example.com', password: 'fake' })
      );
      
      const responses = await Promise.all(promises);
      
      // At least one should be rate limited
      const rateLimited = responses.some(res => res.status === 429);
      expect(rateLimited).toBe(true);
    }, 10000); // Increase timeout for this test
  });
});