const request = require('supertest');
const createTestApp = require('../../src/testApp');

describe('Talks Controller - Unit Tests', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });
  describe('GET /api/talks', () => {
    test('should return all talks successfully', async () => {
      const response = await request(app)
        .get('/api/talks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return talks with required properties', async () => {
      const response = await request(app)
        .get('/api/talks')
        .expect(200);

      const talk = response.body[0];
      expect(talk).toHaveProperty('id');
      expect(talk).toHaveProperty('title');
      expect(talk).toHaveProperty('description');
      expect(talk).toHaveProperty('speakers');
      expect(talk).toHaveProperty('startTime');
      expect(talk).toHaveProperty('endTime');
      expect(talk).toHaveProperty('location');
    });
  });

  describe('GET /api/talks/:id', () => {
    test('should return specific talk when valid ID provided', async () => {
      // First get all talks to get a valid ID
      const talksResponse = await request(app).get('/api/talks');
      const validId = talksResponse.body[0].id;

      const response = await request(app)
        .get(`/api/talks/${validId}`)
        .expect(200);

      expect(response.body.id).toBe(validId);
      expect(response.body).toHaveProperty('title');
    });

    test('should return 404 when talk not found', async () => {
      const response = await request(app)
        .get('/api/talks/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Talk not found');
    });

    // Boundary Value Analysis: Testing edge cases for talk ID
    test('should handle empty string ID gracefully', async () => {
      const response = await request(app)
        .get('/api/talks/')
        .expect(200); // Should return all talks instead

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle very long ID gracefully', async () => {
      const veryLongId = 'a'.repeat(1000);
      const response = await request(app)
        .get(`/api/talks/${veryLongId}`)
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
    });
  });

  describe('POST /api/talks', () => {
    // Equivalence Partitioning: Valid talk data
    const validTalkData = {
      title: 'Test Talk',
      description: 'A test talk for unit testing',
      speakers: [
        {
          name: 'Test Speaker',
          bio: 'A test speaker bio',
          photo: ''
        }
      ],
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      endTime: new Date(Date.now() + 90000000), // Tomorrow + 1 hour
      location: 'Test Room',
      maxAttendees: 50,
      tags: ['Testing', 'QA']
    };

    test('should create talk with valid data', async () => {
      const response = await request(app)
        .post('/api/talks')
        .send(validTalkData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(validTalkData.title);
      expect(response.body.description).toBe(validTalkData.description);
    });

    // Equivalence Partitioning: Invalid talk data - missing required fields
    test('should reject talk creation with missing title', async () => {
      const invalidData = { ...validTalkData };
      delete invalidData.title;

      const response = await request(app)
        .post('/api/talks')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Error creating talk');
    });

    test('should reject talk creation with missing description', async () => {
      const invalidData = { ...validTalkData };
      delete invalidData.description;

      const response = await request(app)
        .post('/api/talks')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    // Boundary Value Analysis: Testing capacity limits
    test('should accept talk with maxAttendees at minimum boundary (1)', async () => {
      const boundaryData = { ...validTalkData, maxAttendees: 1 };

      const response = await request(app)
        .post('/api/talks')
        .send(boundaryData)
        .expect(201);

      expect(response.body.maxAttendees).toBe(1);
    });

    test('should accept talk with maxAttendees at reasonable maximum (1000)', async () => {
      const boundaryData = { ...validTalkData, maxAttendees: 1000 };

      const response = await request(app)
        .post('/api/talks')
        .send(boundaryData)
        .expect(201);

      expect(response.body.maxAttendees).toBe(1000);
    });

    test('should reject talk with zero maxAttendees', async () => {
      const invalidData = { ...validTalkData, maxAttendees: 0 };

      const response = await request(app)
        .post('/api/talks')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    test('should reject talk with negative maxAttendees', async () => {
      const invalidData = { ...validTalkData, maxAttendees: -1 };

      const response = await request(app)
        .post('/api/talks')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    // Boundary Value Analysis: Testing date/time validation
    test('should reject talk with end time before start time', async () => {
      const invalidData = {
        ...validTalkData,
        startTime: new Date(Date.now() + 90000000), // Tomorrow + 1 hour
        endTime: new Date(Date.now() + 86400000)    // Tomorrow
      };

      const response = await request(app)
        .post('/api/talks')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    test('should reject talk with start time in the past', async () => {
      const invalidData = {
        ...validTalkData,
        startTime: new Date(Date.now() - 86400000), // Yesterday
        endTime: new Date(Date.now() - 82800000)    // Yesterday + 1 hour
      };

      const response = await request(app)
        .post('/api/talks')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/talks/:id', () => {
    test('should update existing talk with valid data', async () => {
      // First create a talk
      const createResponse = await request(app)
        .post('/api/talks')
        .send({
          title: 'Original Title',
          description: 'Original description',
          speakers: [{ name: 'Speaker', bio: 'Bio', photo: '' }],
          startTime: new Date(Date.now() + 86400000),
          endTime: new Date(Date.now() + 90000000),
          location: 'Room A',
          maxAttendees: 50,
          tags: ['Original']
        });

      const talkId = createResponse.body.id;

      // Update the talk
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/talks/${talkId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.description).toBe('Updated description');
    });

    test('should return 404 when updating non-existent talk', async () => {
      const updateData = { title: 'Updated Title' };

      const response = await request(app)
        .put('/api/talks/nonexistent-id')
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
    });
  });

  describe('DELETE /api/talks/:id', () => {
    test('should delete existing talk', async () => {
      // First create a talk
      const createResponse = await request(app)
        .post('/api/talks')
        .send({
          title: 'Talk to Delete',
          description: 'This talk will be deleted',
          speakers: [{ name: 'Speaker', bio: 'Bio', photo: '' }],
          startTime: new Date(Date.now() + 86400000),
          endTime: new Date(Date.now() + 90000000),
          location: 'Room A',
          maxAttendees: 50,
          tags: ['Delete']
        });

      const talkId = createResponse.body.id;

      // Delete the talk
      const response = await request(app)
        .delete(`/api/talks/${talkId}`)
        .expect(200);

      expect(response.body.message).toBe('Talk deleted successfully');

      // Verify talk is deleted
      await request(app)
        .get(`/api/talks/${talkId}`)
        .expect(404);
    });

    test('should return 404 when deleting non-existent talk', async () => {
      const response = await request(app)
        .delete('/api/talks/nonexistent-id')
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
    });
  });
});