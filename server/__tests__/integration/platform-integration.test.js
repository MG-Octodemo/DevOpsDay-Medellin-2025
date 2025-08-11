/**
 * Integration Tests for DevOpsDay Medellin 2025 Platform
 * 
 * This file demonstrates integration testing following ISTQB and ISO 25010 standards.
 * Tests cover API integration, data flow, and end-to-end scenarios.
 */

const request = require('supertest');
const express = require('express');
const talksController = require('../../src/controllers/talks');

// Create test app with basic integration
const createIntegrationApp = () => {
  const app = express();
  app.use(express.json());
  
  // API routes
  app.get('/api/talks', talksController.getAllTalks);
  app.get('/api/talks/:id', talksController.getTalkById);
  
  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  
  return app;
};

describe('Platform Integration Tests - ISO 25010 Quality Validation', () => {
  let app;

  beforeAll(() => {
    app = createIntegrationApp();
  });

  describe('API Integration - Functional Suitability', () => {
    test('should provide complete talk information through API integration', async () => {
      const response = await request(app)
        .get('/api/talks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Verify complete data structure for integration
      const talk = response.body[0];
      
      // Essential properties for frontend integration
      expect(talk).toHaveProperty('id');
      expect(talk).toHaveProperty('title');
      expect(talk).toHaveProperty('description');
      expect(talk).toHaveProperty('speakers');
      expect(talk).toHaveProperty('startTime');
      expect(talk).toHaveProperty('endTime');
      expect(talk).toHaveProperty('location');
      expect(talk).toHaveProperty('maxAttendees');
      expect(talk).toHaveProperty('tags');

      // Validate data types for frontend consumption
      expect(typeof talk.id).toBe('string');
      expect(typeof talk.title).toBe('string');
      expect(typeof talk.description).toBe('string');
      expect(Array.isArray(talk.speakers)).toBe(true);
      expect(Array.isArray(talk.tags)).toBe(true);
      
      // Validate speaker structure
      if (talk.speakers.length > 0) {
        const speaker = talk.speakers[0];
        expect(speaker).toHaveProperty('name');
        expect(speaker).toHaveProperty('bio');
        expect(typeof speaker.name).toBe('string');
        expect(typeof speaker.bio).toBe('string');
      }
    });

    test('should maintain data consistency across individual and list endpoints', async () => {
      // Get all talks
      const listResponse = await request(app)
        .get('/api/talks')
        .expect(200);

      const firstTalk = listResponse.body[0];

      // Get individual talk
      const individualResponse = await request(app)
        .get(`/api/talks/${firstTalk.id}`)
        .expect(200);

      // Data should be consistent between endpoints
      expect(individualResponse.body.id).toBe(firstTalk.id);
      expect(individualResponse.body.title).toBe(firstTalk.title);
      expect(individualResponse.body.description).toBe(firstTalk.description);
      expect(individualResponse.body.location).toBe(firstTalk.location);
      expect(individualResponse.body.startTime).toBe(firstTalk.startTime);
      expect(individualResponse.body.endTime).toBe(firstTalk.endTime);
    });
  });

  describe('Performance Integration - ISO 25010 Performance Efficiency', () => {
    test('should handle multiple concurrent API requests efficiently', async () => {
      const concurrentRequests = 20;
      const requests = [];

      const startTime = Date.now();

      // Create multiple concurrent requests
      for (let i = 0; i < concurrentRequests; i++) {
        requests.push(
          request(app)
            .get('/api/talks')
            .expect(200)
        );
      }

      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // All requests should succeed
      expect(responses).toHaveLength(concurrentRequests);
      responses.forEach(response => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      // Total time should be reasonable for concurrent processing
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(2000); // Should complete within 2 seconds

      // Average response time should be acceptable
      const averageTime = totalTime / concurrentRequests;
      expect(averageTime).toBeLessThan(500); // Average under 500ms
    });

    test('should maintain performance under load with different endpoints', async () => {
      const mixedRequests = [];
      const requestCount = 30;

      // Get a valid talk ID first
      const talksResponse = await request(app).get('/api/talks');
      const validTalkId = talksResponse.body[0].id;

      const startTime = Date.now();

      // Mix of different endpoint calls
      for (let i = 0; i < requestCount; i++) {
        if (i % 3 === 0) {
          mixedRequests.push(request(app).get('/api/talks'));
        } else if (i % 3 === 1) {
          mixedRequests.push(request(app).get(`/api/talks/${validTalkId}`));
        } else {
          mixedRequests.push(request(app).get('/health'));
        }
      }

      const responses = await Promise.allSettled(mixedRequests);
      const endTime = Date.now();

      // Count successful requests
      const successfulRequests = responses.filter(r => r.status === 'fulfilled').length;
      expect(successfulRequests).toBeGreaterThan(requestCount * 0.95); // 95% success rate

      // Performance should remain acceptable
      expect(endTime - startTime).toBeLessThan(3000);
    });
  });

  describe('Security Integration - Input Validation and Sanitization', () => {
    test('should safely handle malicious input across API endpoints', async () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '../../etc/passwd',
        'DROP TABLE talks; --',
        '${alert("injection")}',
        '%3Cscript%3Ealert%28%27xss%27%29%3C%2Fscript%3E'
      ];

      for (const maliciousInput of maliciousInputs) {
        const response = await request(app)
          .get(`/api/talks/${encodeURIComponent(maliciousInput)}`)
          .expect(404);

        // Response should not contain the malicious input
        expect(response.body.message).toBe('Talk not found');
        expect(JSON.stringify(response.body)).not.toContain('<script>');
        expect(JSON.stringify(response.body)).not.toContain('alert');
        expect(JSON.stringify(response.body)).not.toContain('DROP TABLE');
      }
    });

    test('should validate request headers securely', async () => {
      const response = await request(app)
        .get('/api/talks')
        .set('X-Malicious-Header', '<script>alert("xss")</script>')
        .set('User-Agent', 'MaliciousBot/1.0 <script>evil()</script>')
        .expect(200);

      // Request should succeed despite malicious headers
      expect(Array.isArray(response.body)).toBe(true);
      
      // Response should not reflect malicious headers
      expect(JSON.stringify(response.headers)).not.toContain('<script>');
    });
  });

  describe('Platform Health Monitoring', () => {
    test('should provide comprehensive health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      
      // Timestamp should be recent (within last minute)
      const timestamp = new Date(response.body.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - timestamp.getTime();
      expect(timeDiff).toBeLessThan(60000); // Less than 1 minute
    });

    test('should maintain health check performance', async () => {
      const healthChecks = [];
      const checkCount = 10;

      const startTime = Date.now();

      for (let i = 0; i < checkCount; i++) {
        healthChecks.push(request(app).get('/health').expect(200));
      }

      await Promise.all(healthChecks);
      const endTime = Date.now();

      // Health checks should be very fast
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(1000); // All checks under 1 second

      const averageTime = totalTime / checkCount;
      expect(averageTime).toBeLessThan(100); // Average under 100ms
    });
  });
});