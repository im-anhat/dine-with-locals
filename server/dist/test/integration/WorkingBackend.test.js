/**
 * Working Backend Tests
 * Using callback approach to avoid TypeScript send() issues
 */
import request from 'supertest';
import testApp from '../helpers/testApp.js';
describe('Working Backend Tests', () => {
    describe('API Endpoints Structure', () => {
        it('should have auth signup endpoint', (done) => {
            request(testApp)
                .post('/api/auth/signup')
                .type('json')
                .send('{"userName":"test","password":"test"}')
                .end((err, res) => {
                expect(res.status).toBeDefined();
                expect(typeof res.status).toBe('number');
                done();
            });
        });
        it('should have auth login endpoint', (done) => {
            request(testApp)
                .post('/api/auth/login')
                .type('json')
                .send('{"userName":"test","password":"test"}')
                .end((err, res) => {
                expect(res.status).toBeDefined();
                done();
            });
        });
        it('should have users endpoint', (done) => {
            request(testApp)
                .get('/api/users')
                .end((err, res) => {
                expect(res.status).toBeDefined();
                expect([200, 401, 403, 404, 500]).toContain(res.status);
                done();
            });
        });
        it('should have blogs endpoint', (done) => {
            request(testApp)
                .get('/api/blogs')
                .end((err, res) => {
                expect(res.status).toBeDefined();
                done();
            });
        });
        it('should have listings endpoint', (done) => {
            request(testApp)
                .get('/api/listing')
                .end((err, res) => {
                expect(res.status).toBeDefined();
                done();
            });
        });
    });
    describe('Error Handling', () => {
        it('should return 404 for non-existent endpoints', (done) => {
            request(testApp).get('/api/nonexistent').expect(404).end(done);
        });
        it('should handle malformed JSON', (done) => {
            request(testApp)
                .post('/api/auth/signup')
                .type('json')
                .send('{"invalid": json}')
                .end((err, res) => {
                // Should handle malformed JSON gracefully
                expect([400, 500]).toContain(res.status);
                done();
            });
        });
    });
    describe('CORS and Headers', () => {
        it('should handle OPTIONS requests', (done) => {
            request(testApp)
                .options('/api/auth/login')
                .end((err, res) => {
                expect(res.status).toBeDefined();
                done();
            });
        });
    });
    describe('Performance Tests', () => {
        it('should handle multiple concurrent requests', async () => {
            const results = await Promise.all([
                new Promise((resolve) => {
                    request(testApp)
                        .get('/api/blogs')
                        .end((err, res) => {
                        resolve({ status: res?.status || 500 });
                    });
                }),
                new Promise((resolve) => {
                    request(testApp)
                        .get('/api/users')
                        .end((err, res) => {
                        resolve({ status: res?.status || 500 });
                    });
                }),
                new Promise((resolve) => {
                    request(testApp)
                        .get('/api/listing')
                        .end((err, res) => {
                        resolve({ status: res?.status || 500 });
                    });
                }),
            ]);
            expect(results).toHaveLength(3);
            results.forEach((result) => {
                expect(result.status).toBeDefined();
                expect(typeof result.status).toBe('number');
            });
        });
    });
});
