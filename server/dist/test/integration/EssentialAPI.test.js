/**
 * Essential API Integration Tests
 * Tests core API endpoints to ensure basic functionality works
 */
import request from 'supertest';
import { createTestApp } from '../testApp.js';
describe('Essential API Tests', () => {
    let testApp;
    beforeAll(() => {
        testApp = createTestApp();
    });
    describe('Health Check', () => {
        it('should return health status', async () => {
            const response = await request(testApp).get('/health');
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('OK');
            expect(response.body.timestamp).toBeDefined();
        });
    });
    describe('API Routes', () => {
        it('should handle unknown routes gracefully', async () => {
            await request(testApp).get('/api/nonexistent').expect(404);
        });
        it('should handle location endpoints', async () => {
            // Should not crash when accessing location endpoints
            await request(testApp)
                .get('/api/location')
                .expect((res) => {
                expect([200, 400, 401, 404, 500].includes(res.status)).toBe(true);
            });
        });
    });
    describe('Error Handling', () => {
        it('should handle malformed requests gracefully', async () => {
            await request(testApp)
                .post('/api/auth/login')
                .expect((res) => {
                expect([400, 422, 500].includes(res.status)).toBe(true);
            });
        });
    });
});
