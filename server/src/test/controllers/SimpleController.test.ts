/**
 * Simple Controller Tests
 * Basic tests to verify our testing setup works correctly
 */

import request from 'supertest';
import express, { Request, Response } from 'express';

describe('Simple Controller Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get('/test', (req: Request, res: Response) => {
      res.json({ message: 'Test endpoint working' });
    });

    app.post('/echo', (req: Request, res: Response) => {
      res.json({ received: req.body });
    });
  });

  it('should respond to GET /test', async () => {
    const response: any = await (request(app) as any).get('/test').expect(200);

    expect(response.body).toEqual({ message: 'Test endpoint working' });
  });

  it('should echo POST data', async () => {
    const testData = { name: 'test' };

    const response: any = await (request(app) as any)
      .post('/echo')
      .send(testData)
      .expect(200);

    expect(response.body.received).toEqual(testData);
  });

  it('should return 404 for unknown routes', async () => {
    await (request(app) as any).get('/unknown').expect(404);
  });
});
