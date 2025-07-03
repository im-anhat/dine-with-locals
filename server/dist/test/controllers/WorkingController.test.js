/**
 * Working Controller Test
 * Tests using supertest with correct TypeScript typing
 */
import request from 'supertest';
import express from 'express';
describe('Working Controller Tests', () => {
    let app;
    beforeEach(() => {
        app = express();
        app.use(express.json());
        // Simple health check endpoint
        app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                service: 'test-service',
            });
        });
        // Echo endpoint for testing POST requests
        app.post('/echo', (req, res) => {
            res.status(200).json({
                message: 'Echo successful',
                received: req.body,
                method: req.method,
            });
        });
        // Validation endpoint - use explicit any types to avoid TS issues
        app.post('/users', (req, res) => {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({
                    error: 'Name and email are required',
                    received: req.body,
                });
            }
            res.status(201).json({
                success: true,
                user: { name, email, id: Math.random().toString(36) },
            });
        });
    });
    describe('GET endpoints', () => {
        it('should return health status', async () => {
            await request(app)
                .get('/health')
                .expect(200)
                .expect((res) => {
                expect(res.body.status).toBe('OK');
                expect(res.body).toHaveProperty('timestamp');
            });
        });
        it('should return 404 for unknown routes', async () => {
            await request(app).get('/unknown').expect(404);
        });
    });
    describe('POST endpoints', () => {
        it('should echo request data', async () => {
            const testData = { message: 'Hello, World!', number: 42 };
            await request(app)
                .post('/echo')
                .send(testData)
                .expect(200)
                .expect((res) => {
                expect(res.body.received).toEqual(testData);
                expect(res.body.method).toBe('POST');
            });
        });
        it('should create user with valid data', async () => {
            const userData = { name: 'John Doe', email: 'john@example.com' };
            await request(app)
                .post('/users')
                .send(userData)
                .expect(201)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.user.name).toBe(userData.name);
                expect(res.body.user.email).toBe(userData.email);
                expect(res.body.user).toHaveProperty('id');
            });
        });
        it('should reject invalid user data', async () => {
            const invalidData = { name: 'John Doe' }; // missing email
            await request(app)
                .post('/users')
                .send(invalidData)
                .expect(400)
                .expect((res) => {
                expect(res.body.error).toContain('required');
            });
        });
    });
    describe('Request headers and content types', () => {
        it('should handle JSON content type', async () => {
            await request(app)
                .post('/echo')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify({ test: 'data' }))
                .expect(200)
                .expect((res) => {
                expect(res.body.received.test).toBe('data');
            });
        });
        it('should return JSON responses', async () => {
            await request(app)
                .get('/health')
                .expect(200)
                .expect((res) => {
                expect(res.headers['content-type']).toMatch(/application\/json/);
            });
        });
    });
});
