/**
 * Basic API Integration Tests
 * Tests basic API functionality and middleware setup
 */

import request from 'supertest';
import { createTestApp } from '../testApp.js';

describe('API Integration Tests', () => {
  let app: any;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('Basic API Health', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404);
    });

    it('should handle CORS properly', async () => {
      const response = await request(app)
        .options('/api/auth/login')
        .expect(200);

      // Check CORS headers are present
      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:5173',
      );
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should parse JSON requests', async () => {
      // This test implicitly verifies JSON parsing works
      // by sending JSON and expecting it to be processed
      const response = await request(app)
        .post('/api/auth/login')
        .send({ userName: 'test', password: 'test' })
        .set('Content-Type', 'application/json');

      // Should not fail due to JSON parsing issues
      expect(response.status).not.toBe(500);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('{"invalid": json}')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should handle large payloads gracefully', async () => {
      const largePayload = {
        userName: 'test',
        password: 'test',
        largeField: 'x'.repeat(10000), // 10KB of data
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(largePayload);

      // Should handle large payload without crashing
      expect(response.status).not.toBe(500);
    });
  });

  describe('Security Headers', () => {
    it('should not expose sensitive information in error responses', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404);

      // Should not expose stack traces or internal paths
      expect(response.text).not.toMatch(/\/Users/);
      expect(response.text).not.toMatch(/at /);
      expect(response.text).not.toMatch(/Error:/);
    });
  });
});
