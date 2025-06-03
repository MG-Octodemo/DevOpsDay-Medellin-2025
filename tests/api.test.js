const request = require('supertest');
const app = require('../server');

// Test credentials
const testUser = {
  email: 'juan@example.com',
  password: 'password123'
};

const authHeader = 'Basic ' + Buffer.from(`${testUser.email}:${testUser.password}`).toString('base64');

describe('DevOps Day Registration API', () => {
  describe('Health Check', () => {
    test('GET /api/health should return OK', async () => {
      const response = await request(app)
        .get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Authentication', () => {
    test('GET /api/me without auth should return 401', async () => {
      const response = await request(app)
        .get('/api/me');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Authentication required');
    });

    test('GET /api/me with invalid auth should return 401', async () => {
      const invalidAuth = 'Basic ' + Buffer.from('invalid:credentials').toString('base64');
      const response = await request(app)
        .get('/api/me')
        .set('Authorization', invalidAuth);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    test('GET /api/me with valid auth should return user info', async () => {
      const response = await request(app)
        .get('/api/me')
        .set('Authorization', authHeader);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('Talks API', () => {
    test('GET /api/talks should return list of talks', async () => {
      const response = await request(app)
        .get('/api/talks')
        .set('Authorization', authHeader);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const talk = response.body[0];
      expect(talk).toHaveProperty('id');
      expect(talk).toHaveProperty('title');
      expect(talk).toHaveProperty('description');
      expect(talk).toHaveProperty('schedule');
      expect(talk).toHaveProperty('speaker');
    });
  });

  describe('Registration API', () => {
    test('GET /api/my-registrations should return user registrations', async () => {
      const response = await request(app)
        .get('/api/my-registrations')
        .set('Authorization', authHeader);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/talks/:id/register should register user for talk', async () => {
      // First get a talk ID
      const talksResponse = await request(app)
        .get('/api/talks')
        .set('Authorization', authHeader);
      
      const talkId = talksResponse.body[0].id;
      
      const response = await request(app)
        .post(`/api/talks/${talkId}/register`)
        .set('Authorization', authHeader);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Successfully registered for talk');
      expect(response.body).toHaveProperty('registrationId');
    });

    test('POST /api/talks/:id/register should not allow duplicate registration', async () => {
      // Get a talk ID
      const talksResponse = await request(app)
        .get('/api/talks')
        .set('Authorization', authHeader);
      
      const talkId = talksResponse.body[0].id;
      
      // Try to register again
      const response = await request(app)
        .post(`/api/talks/${talkId}/register`)
        .set('Authorization', authHeader);
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Already registered for this talk');
    });

    test('DELETE /api/talks/:id/register should unregister user from talk', async () => {
      // Get a talk ID
      const talksResponse = await request(app)
        .get('/api/talks')
        .set('Authorization', authHeader);
      
      const talkId = talksResponse.body[0].id;
      
      const response = await request(app)
        .delete(`/api/talks/${talkId}/register`)
        .set('Authorization', authHeader);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Successfully unregistered from talk');
    });

    test('POST /api/talks/999/register should return 404 for non-existent talk', async () => {
      const response = await request(app)
        .post('/api/talks/999/register')
        .set('Authorization', authHeader);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Talk not found');
    });
  });

  describe('Error Handling', () => {
    test('GET /api/nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .set('Authorization', authHeader);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not found');
    });
  });
});