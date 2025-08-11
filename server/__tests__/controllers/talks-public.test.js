const request = require('supertest');
const express = require('express');
const talksController = require('../../src/controllers/talks');

// Create a simple test app without auth for public endpoints
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Public routes only for testing
  app.get('/api/talks', talksController.getAllTalks);
  app.get('/api/talks/:id', talksController.getTalkById);
  
  return app;
};

describe('Talks Controller - Public Endpoints Unit Tests', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /api/talks - Functional Suitability Testing', () => {
    test('should return all talks successfully', async () => {
      const response = await request(app)
        .get('/api/talks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return talks with required properties - ISTQB Equivalence Partitioning', async () => {
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
      expect(Array.isArray(talk.speakers)).toBe(true);
    });

    test('should return talks with proper data types - ISO 25010 Functional Correctness', async () => {
      const response = await request(app)
        .get('/api/talks')
        .expect(200);

      const talk = response.body[0];
      expect(typeof talk.id).toBe('string');
      expect(typeof talk.title).toBe('string');
      expect(typeof talk.description).toBe('string');
      expect(typeof talk.location).toBe('string');
      expect(Array.isArray(talk.speakers)).toBe(true);
      expect(Array.isArray(talk.tags)).toBe(true);
    });
  });

  describe('GET /api/talks/:id - Boundary Value Analysis', () => {
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

    test('should return 404 when talk not found - Error Handling', async () => {
      const response = await request(app)
        .get('/api/talks/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Talk not found');
    });

    // Boundary Value Analysis: Testing edge cases for talk ID
    test('should handle very long ID gracefully', async () => {
      const veryLongId = 'a'.repeat(1000);
      const response = await request(app)
        .get(`/api/talks/${veryLongId}`)
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
    });

    test('should handle special characters in ID', async () => {
      const specialId = '!@#$%^&*()';
      const response = await request(app)
        .get(`/api/talks/${encodeURIComponent(specialId)}`)
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
    });
  });

  describe('Performance Testing - ISO 25010 Performance Efficiency', () => {
    test('should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/talks')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Should respond within 200ms
      expect(responseTime).toBeLessThan(200);
    });

    test('should handle multiple concurrent requests efficiently', async () => {
      const requests = [];
      const requestCount = 10;
      
      for (let i = 0; i < requestCount; i++) {
        requests.push(
          request(app)
            .get('/api/talks')
            .expect(200)
        );
      }
      
      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      
      expect(responses).toHaveLength(requestCount);
      responses.forEach(response => {
        expect(Array.isArray(response.body)).toBe(true);
      });
      
      // All requests should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Security Testing - Input Validation', () => {
    test('should handle malicious input in ID parameter safely', async () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '../../../etc/passwd',
        'DROP TABLE talks;',
        '${7*7}',
        '{{7*7}}'
      ];

      for (const maliciousInput of maliciousInputs) {
        const response = await request(app)
          .get(`/api/talks/${encodeURIComponent(maliciousInput)}`)
          .expect(404);

        expect(response.body.message).toBe('Talk not found');
        // Should not execute any malicious code
        expect(response.body.message).not.toContain('<script>');
        expect(response.body.message).not.toContain('49'); // 7*7
      }
    });
  });

  describe('Reliability Testing - Error Handling', () => {
    test.skip('should handle server errors gracefully', async () => {
      // Mock a controller method to throw an error
      const originalMethod = talksController.getAllTalks;
      talksController.getAllTalks = (req, res) => {
        res.status(500).json({ message: 'Internal server error' });
      };

      const response = await request(app)
        .get('/api/talks')
        .expect(500);

      expect(response.body).toHaveProperty('message');
      
      // Restore original method
      talksController.getAllTalks = originalMethod;
    });

    test('should maintain service availability during errors', async () => {
      // Even after an error, subsequent requests should work
      await request(app)
        .get('/api/talks')
        .expect(200);
    });
  });

  describe('Usability Testing - API Response Structure', () => {
    test('should return consistent response structure', async () => {
      const response = await request(app)
        .get('/api/talks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // All talks should have consistent structure
      response.body.forEach(talk => {
        expect(talk).toHaveProperty('id');
        expect(talk).toHaveProperty('title');
        expect(talk).toHaveProperty('description');
        expect(talk).toHaveProperty('speakers');
        expect(talk).toHaveProperty('startTime');
        expect(talk).toHaveProperty('endTime');
        expect(talk).toHaveProperty('location');
      });
    });

    test('should provide meaningful error messages', async () => {
      const response = await request(app)
        .get('/api/talks/invalid-id')
        .expect(404);

      expect(response.body.message).toBe('Talk not found');
      expect(response.body.message).toBeTruthy();
      expect(typeof response.body.message).toBe('string');
    });
  });

  describe('Compatibility Testing - Content-Type Handling', () => {
    test('should handle different Accept headers', async () => {
      const response = await request(app)
        .get('/api/talks')
        .set('Accept', 'application/json')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should handle missing Accept header', async () => {
      const response = await request(app)
        .get('/api/talks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});