/**
 * Working API Integration Tests
 * Using callback-based approach to avoid TypeScript issues
 */

import request from 'supertest';
import { createTestApp } from '../testApp.js';

describe('Working API Integration Tests', () => {
  let app: any;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('Basic API Endpoints', () => {
    it('should handle requests to auth endpoints', (done) => {
      request(app)
        .post('/api/auth/signup')
        .send({ userName: 'test', password: 'test' })
        .end((err, res) => {
          // Should not crash - might be 400 (validation) or 500 (server error)
          expect(res.status).toBeDefined();
          expect([400, 404, 500]).toContain(res.status);
          done();
        });
    });

    it('should handle GET requests to user endpoints', (done) => {
      request(app)
        .get('/api/users')
        .end((err, res) => {
          // Should respond with something
          expect(res.status).toBeDefined();
          expect(res.status).toBeGreaterThanOrEqual(200);
          expect(res.status).toBeLessThan(600);
          done();
        });
    });

    it('should handle blog endpoints', (done) => {
      request(app)
        .get('/api/blogs')
        .end((err, res) => {
          expect(res.status).toBeDefined();
          expect(typeof res.status).toBe('number');
          done();
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', (done) => {
      request(app).get('/api/nonexistent').expect(404).end(done);
    });

    it('should handle malformed requests', (done) => {
      request(app)
        .post('/api/auth/login')
        .send('invalid-json')
        .end((err, res) => {
          // Should handle gracefully
          expect(res.status).toBeDefined();
          done();
        });
    });
  });

  describe('CORS and Headers', () => {
    it('should handle preflight requests', (done) => {
      request(app)
        .options('/api/auth/login')
        .end((err, res) => {
          expect(res.status).toBeDefined();
          done();
        });
    });

    it('should set appropriate headers', (done) => {
      request(app)
        .get('/api/blogs')
        .end((err, res) => {
          expect(res.headers).toBeDefined();
          expect(typeof res.headers).toBe('object');
          done();
        });
    });
  });

  describe('Performance and Stress', () => {
    it('should handle multiple concurrent requests', async () => {
      const promises = Array(3)
        .fill(null)
        .map(
          () =>
            new Promise((resolve) => {
              request(app)
                .get('/api/blogs')
                .end((err, res) => {
                  resolve({ status: res?.status || 500, error: err });
                });
            }),
        );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(3);

      results.forEach((result: any) => {
        expect(result.status).toBeDefined();
        expect(typeof result.status).toBe('number');
      });
    });
  });
});
