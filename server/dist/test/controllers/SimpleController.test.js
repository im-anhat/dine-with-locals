/**
 * Simple Controller Tests
 * Basic tests to verify our testing setup works correctly
 */
import request from 'supertest';
import express from 'express';
describe('Simple Controller Tests', () => {
    let app;
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.get('/test', (req, res) => {
            res.json({ message: 'Test endpoint working' });
        });
        app.post('/echo', (req, res) => {
            res.json({ received: req.body });
        });
    });
    it('should respond to GET /test', async () => {
        const response = await request(app).get('/test').expect(200);
        expect(response.body).toEqual({ message: 'Test endpoint working' });
    });
    it('should echo POST data', async () => {
        const testData = { name: 'test' };
        const response = await request(app)
            .post('/echo')
            .send(testData)
            .expect(200);
        expect(response.body.received).toEqual(testData);
    });
    it('should return 404 for unknown routes', async () => {
        await request(app).get('/unknown').expect(404);
    });
});
