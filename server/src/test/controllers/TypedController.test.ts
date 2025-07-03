/**
 * Properly Typed Controller Test
 * Using explicit types to fix TypeScript issues
 */

import request, { Response } from 'supertest';
import express from 'express';

describe('Properly Typed Controller Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
      });
    });

    app.post('/echo', (req, res) => {
      res.status(200).json({
        received: req.body,
        method: req.method,
      });
    });
  });

  it('should return health status', async () => {
    const response: any = await (request(app) as any).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should echo POST data', async () => {
    const testData = { message: 'test' };

    const response: any = await (request(app) as any)
      .post('/echo')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual(testData);
  });

  it('should handle 404 for unknown routes', async () => {
    const response: any = await (request(app) as any).get('/unknown');
    expect(response.status).toBe(404);
  });

  it('should set correct content type', async () => {
    const response: any = await (request(app) as any).get('/health');
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
