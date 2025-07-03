/**
 * Minimal Supertest Test
 * Testing with the most basic supertest usage
 */

import request from 'supertest';
import express from 'express';

describe('Minimal Supertest', () => {
  it('should work with basic express app', (done) => {
    const app = express();
    app.get('/test', (req, res) => {
      res.json({ success: true });
    });

    request(app)
      .get('/test')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).toBe(true);
        done();
      });
  });

  it('should work with async/await and any casting', async () => {
    const app = express();
    app.get('/async', (req, res) => {
      res.json({ async: true });
    });

    const response = (await request(app).get('/async')) as any;

    expect(response.status).toBe(200);
    expect(response.body.async).toBe(true);
  });
});
