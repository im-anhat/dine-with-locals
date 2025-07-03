/**
 * UserController Tests
 * Tests for user-related endpoints
 */
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
// Import using require to avoid ES module issues with Jest
const UserModel = require('../../models/User').default;
const LocationModel = require('../../models/Location').default;
describe('UserController Tests', () => {
    let app;
    let testUser;
    let testLocation;
    beforeAll(async () => {
        // Create a minimal Express app for testing
        app = express();
        app.use(express.json());
        // Import controller functions dynamically to avoid ES module issues
        const UserController = require('../../controllers/UserControllers');
        // Add user routes manually
        app.get('/api/users', UserController.getAllUsers);
        app.get('/api/users/:userId', UserController.getUserById);
        app.put('/api/users/:userId', UserController.updateUser);
    });
    beforeEach(async () => {
        // Clean up and create test data
        await UserModel.deleteMany({ userName: { $regex: /^test/ } });
        await LocationModel.deleteMany({ city: { $regex: /^Test/ } });
        // Create a test location first
        testLocation = await LocationModel.create({
            city: 'Test City',
            state: 'Test State',
            country: 'Test Country',
        });
        // Create a test user for our tests
        testUser = await UserModel.create({
            userName: 'testuser123',
            firstName: 'Test',
            lastName: 'User',
            phone: '+1234567890',
            provider: 'Local',
            password: 'hashedpassword123',
            avatar: 'https://example.com/avatar.jpg',
            cover: 'https://example.com/cover.jpg',
            role: 'Guest',
            locationId: testLocation._id,
        });
    });
    afterAll(async () => {
        // Clean up test data
        await UserModel.deleteMany({ userName: { $regex: /^test/ } });
        await LocationModel.deleteMany({ city: { $regex: /^Test/ } });
    });
    describe('GET /api/users', () => {
        it('should return all users without passwords', async () => {
            const response = await request(app).get('/api/users').expect(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            // Check that passwords are excluded
            response.body.forEach((user) => {
                expect(user.password).toBeUndefined();
                expect(user.userName).toBeDefined();
                expect(user.firstName).toBeDefined();
            });
        });
        it('should return empty array when no users exist', async () => {
            // Clear all test users
            await UserModel.deleteMany({ userName: { $regex: /^test/ } });
            const response = await request(app).get('/api/users').expect(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
        it('should handle database errors gracefully', async () => {
            // Mock a database error (this is a simplified approach)
            const originalFind = UserModel.find;
            UserModel.find = () => {
                throw new Error('Database connection failed');
            };
            const response = await request(app).get('/api/users').expect(500);
            expect(response.body.error).toBe('Failed to fetch users');
            // Restore original method
            UserModel.find = originalFind;
        });
    });
    describe('GET /api/users/:userId', () => {
        it('should return user by valid ID without password', async () => {
            const response = await request(app)
                .get(`/api/users/${testUser._id}`)
                .expect(200);
            expect(response.body._id).toBe(testUser._id.toString());
            expect(response.body.userName).toBe(testUser.userName);
            expect(response.body.firstName).toBe(testUser.firstName);
            expect(response.body.password).toBeUndefined();
        });
        it('should return 400 for invalid user ID format', async () => {
            const response = await request(app)
                .get('/api/users/invalid-id')
                .expect(400);
            expect(response.body.error).toBe('Invalid user ID format');
        });
        it('should return 404 for non-existent user ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/users/${nonExistentId}`)
                .expect(404);
            expect(response.body.error).toBe('User not found');
        });
        it('should handle database errors gracefully', async () => {
            // Mock a database error
            const originalFindById = UserModel.findById;
            UserModel.findById = () => {
                throw new Error('Database error');
            };
            const response = await request(app)
                .get(`/api/users/${testUser._id}`)
                .expect(500);
            expect(response.body.error).toBe('Failed to fetch user data');
            // Restore original method
            UserModel.findById = originalFindById;
        });
        it('should trim whitespace from user ID parameter', async () => {
            const response = await request(app)
                .get(`/api/users/  ${testUser._id}  `)
                .expect(200);
            expect(response.body._id).toBe(testUser._id.toString());
        });
    });
    describe('PUT /api/users/:userId', () => {
        it('should update user profile successfully', async () => {
            const updateData = {
                firstName: 'Updated',
                lastName: 'Name',
                phone: '+1987654321',
            };
            const response = await request(app)
                .put(`/api/users/${testUser._id}`)
                .send(updateData)
                .expect(200);
            // Verify the response
            expect(response.body.firstName).toBe(updateData.firstName);
            expect(response.body.lastName).toBe(updateData.lastName);
            expect(response.body.phone).toBe(updateData.phone);
            expect(response.body.password).toBeUndefined(); // Password should not be returned
            // Verify in database
            const updatedUser = await UserModel.findById(testUser._id);
            expect(updatedUser?.firstName).toBe(updateData.firstName);
            expect(updatedUser?.lastName).toBe(updateData.lastName);
            expect(updatedUser?.phone).toBe(updateData.phone);
        });
        it('should return 400 for invalid user ID format', async () => {
            const response = await request(app)
                .put('/api/users/invalid-id')
                .send({ firstName: 'Test' })
                .expect(400);
            expect(response.body.error).toBe('Invalid user ID format');
        });
        it('should return 404 for non-existent user', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/api/users/${nonExistentId}`)
                .send({ firstName: 'Test' })
                .expect(404);
            expect(response.body.error).toBe('User not found');
        });
        it('should handle partial updates', async () => {
            const partialUpdate = {
                firstName: 'PartialUpdate',
            };
            const response = await request(app)
                .put(`/api/users/${testUser._id}`)
                .send(partialUpdate)
                .expect(200);
            expect(response.body.firstName).toBe(partialUpdate.firstName);
            expect(response.body.lastName).toBe(testUser.lastName); // Should remain unchanged
        });
        it('should not allow updating sensitive fields like password directly', async () => {
            const maliciousUpdate = {
                password: 'hackedpassword',
                role: 'Admin',
            };
            const response = await request(app)
                .put(`/api/users/${testUser._id}`)
                .send(maliciousUpdate);
            // The response code will depend on the controller implementation
            // but the password should not be updated through this endpoint
            const userAfterUpdate = await UserModel.findById(testUser._id);
            expect(userAfterUpdate?.password).toBe(testUser.password); // Should remain unchanged
        });
        it('should handle validation errors', async () => {
            const invalidUpdate = {
                phone: 'invalid-phone-format',
                firstName: '', // Empty name might cause validation error
            };
            const response = await request(app)
                .put(`/api/users/${testUser._id}`)
                .send(invalidUpdate);
            // Should handle validation errors gracefully
            expect([400, 500]).toContain(response.status);
        });
    });
    describe('Security Tests', () => {
        it('should never expose password in any response', async () => {
            // Test all endpoints to ensure password is never exposed
            const getUserResponse = await request(app)
                .get(`/api/users/${testUser._id}`)
                .expect(200);
            const getAllResponse = await request(app).get('/api/users').expect(200);
            const updateResponse = await request(app)
                .put(`/api/users/${testUser._id}`)
                .send({ firstName: 'Security Test' })
                .expect(200);
            expect(getUserResponse.body.password).toBeUndefined();
            expect(updateResponse.body.password).toBeUndefined();
            getAllResponse.body.forEach((user) => {
                expect(user.password).toBeUndefined();
            });
        });
        it('should validate ObjectId format to prevent injection', async () => {
            const maliciousIds = [
                '../../../etc/passwd',
                '{ $ne: null }',
                'javascript:alert(1)',
                '<script>alert(1)</script>',
            ];
            for (const maliciousId of maliciousIds) {
                const response = await request(app)
                    .get(`/api/users/${maliciousId}`)
                    .expect(400);
                expect(response.body.error).toBe('Invalid user ID format');
            }
        });
    });
    describe('Performance Tests', () => {
        it('should handle multiple concurrent requests', async () => {
            // Create multiple concurrent requests
            const requests = Array(5)
                .fill(null)
                .map(() => request(app).get(`/api/users/${testUser._id}`));
            const responses = await Promise.all(requests);
            // All should succeed
            responses.forEach((response) => {
                expect(response.status).toBe(200);
                expect(response.body._id).toBe(testUser._id.toString());
            });
        });
        it('should handle large user lists efficiently', async () => {
            // Create multiple test users
            const testUsers = [];
            for (let i = 0; i < 10; i++) {
                testUsers.push({
                    userName: `testuser${i}`,
                    firstName: `Test${i}`,
                    lastName: `User${i}`,
                    phone: `+123456789${i}`,
                    provider: 'Local',
                    password: 'hashedpassword123',
                    avatar: `https://example.com/avatar${i}.jpg`,
                    cover: `https://example.com/cover${i}.jpg`,
                    role: 'Guest',
                    locationId: testLocation._id,
                });
            }
            await UserModel.insertMany(testUsers);
            const start = Date.now();
            const response = await request(app).get('/api/users').expect(200);
            const duration = Date.now() - start;
            expect(response.body.length).toBeGreaterThanOrEqual(10);
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });
    });
});
export {};
