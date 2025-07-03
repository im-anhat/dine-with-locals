/**
 * AuthController Tests
 * Tests for authentication endpoints including signup, login, and security
 */
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Import using require to avoid ES module issues with Jest
const UserModel = require('../../models/User').default;
const LocationModel = require('../../models/Location').default;
const AuthController = require('../../controllers/AuthController');
describe('AuthController Tests', () => {
    let app;
    let testLocation;
    beforeAll(() => {
        // Create a minimal Express app for testing
        app = express();
        app.use(express.json());
        // Add auth routes manually to avoid complex dependencies
        app.post('/api/auth/login', AuthController.loginUser);
        app.post('/api/auth/signup', AuthController.signupUser);
    });
    beforeEach(async () => {
        // Clean up test data
        await UserModel.deleteMany({ userName: { $regex: /^test/ } });
        await LocationModel.deleteMany({ city: { $regex: /^Test/ } });
        // Create a test location for user creation
        testLocation = await LocationModel.create({
            city: 'Test City',
            state: 'Test State',
            country: 'Test Country',
        });
    });
    afterAll(async () => {
        // Clean up test data
        await UserModel.deleteMany({ userName: { $regex: /^test/ } });
    });
    describe('POST /api/auth/signup', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                userName: 'testuser123',
                firstName: 'Test',
                lastName: 'User',
                phone: '1234567890',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                locationId: testLocation._id,
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect(200);
            expect(response.body.Message).toBe('Sign up success');
            // Verify user was created in database
            const user = await UserModel.findOne({ userName: userData.userName });
            expect(user).toBeTruthy();
            expect(user?.firstName).toBe(userData.firstName);
            expect(user?.lastName).toBe(userData.lastName);
            // Verify password was hashed
            expect(user?.password).not.toBe(userData.password);
            if (user) {
                const isPasswordValid = await bcrypt.compare(userData.password, user.password);
                expect(isPasswordValid).toBe(true);
            }
        });
        it('should reject signup with missing required fields', async () => {
            const incompleteUser = {
                userName: 'testuser',
                firstName: 'Test',
                // Missing required fields like lastName, phone, password, etc.
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(incompleteUser)
                .expect(400);
            expect(response.body.Error).toBeDefined();
        });
        it('should reject signup with duplicate username', async () => {
            const userData = {
                userName: 'duplicateuser',
                firstName: 'First',
                lastName: 'User',
                phone: '1234567890',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                locationId: testLocation._id,
            };
            // Create the first user
            await request(app).post('/api/auth/signup').send(userData).expect(200);
            // Try to create another user with the same username
            const duplicateUser = {
                ...userData,
                firstName: 'Second',
                phone: '0987654321',
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(duplicateUser)
                .expect(400);
            expect(response.body.Error).toBe('Username already in use');
        });
        it('should handle validation errors gracefully', async () => {
            const invalidUser = {
                userName: '', // Empty username should fail validation
                firstName: 'Test',
                lastName: 'User',
                password: 'testPassword123',
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(invalidUser)
                .expect(400);
            expect(response.body.Error).toBeDefined();
        });
    });
    describe('POST /api/auth/login', () => {
        let testUserData;
        beforeEach(async () => {
            // Create a test user for login tests
            testUserData = {
                userName: 'logintest',
                firstName: 'Login',
                lastName: 'Test',
                phone: '1234567890',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                locationId: testLocation._id,
            };
            await request(app)
                .post('/api/auth/signup')
                .send(testUserData)
                .expect(200);
        });
        it('should login user with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: testUserData.userName,
                password: testUserData.password,
            })
                .expect(200);
            expect(response.body.message).toBe('Login Successful');
            expect(response.body.token).toBeDefined();
            // Verify token is valid
            const decoded = jwt.verify(response.body.token, process.env.SECRET || 'test-secret');
            expect(decoded._id).toBeDefined();
        });
        it('should reject login with missing username', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                password: testUserData.password,
                // Missing userName
            })
                .expect(400);
            expect(response.body.error).toBe('All fields must be filled');
        });
        it('should reject login with missing password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: testUserData.userName,
                // Missing password
            })
                .expect(400);
            expect(response.body.error).toBe('All fields must be filled');
        });
        it('should reject login with non-existent username', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: 'nonexistentuser',
                password: testUserData.password,
            })
                .expect(400);
            expect(response.body.error).toBe('Username not found');
        });
        it('should reject login with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: testUserData.userName,
                password: 'wrongpassword',
            })
                .expect(400);
            expect(response.body.error).toBe('Incorrect password');
        });
        it('should reject login with empty credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: '',
                password: '',
            })
                .expect(400);
            expect(response.body.error).toBe('All fields must be filled');
        });
    });
    describe('Security Tests', () => {
        it('should hash passwords before storing', async () => {
            const userData = {
                userName: 'securitytest',
                firstName: 'Security',
                lastName: 'Test',
                phone: '1234567890',
                password: 'plainTextPassword',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                locationId: testLocation._id,
            };
            await request(app).post('/api/auth/signup').send(userData).expect(200);
            const user = await UserModel.findOne({ userName: userData.userName });
            expect(user?.password).not.toBe(userData.password);
            expect(user?.password.length).toBeGreaterThan(10); // Should be hashed
            // Should be able to verify the hashed password
            if (user) {
                const isValid = await bcrypt.compare(userData.password, user.password);
                expect(isValid).toBe(true);
            }
        });
        it('should generate unique tokens for different users', async () => {
            const user1Data = {
                userName: 'securityuser1',
                firstName: 'Security',
                lastName: 'User1',
                phone: '1111111111',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar1.jpg',
                cover: 'https://example.com/cover1.jpg',
                locationId: testLocation._id,
            };
            const user2Data = {
                userName: 'securityuser2',
                firstName: 'Security',
                lastName: 'User2',
                phone: '2222222222',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar2.jpg',
                cover: 'https://example.com/cover2.jpg',
                locationId: testLocation._id,
            };
            // Create both users
            await request(app).post('/api/auth/signup').send(user1Data).expect(200);
            await request(app).post('/api/auth/signup').send(user2Data).expect(200);
            // Login both users
            const response1 = await request(app)
                .post('/api/auth/login')
                .send({ userName: user1Data.userName, password: user1Data.password })
                .expect(200);
            const response2 = await request(app)
                .post('/api/auth/login')
                .send({ userName: user2Data.userName, password: user2Data.password })
                .expect(200);
            // Tokens should be different
            expect(response1.body.token).not.toBe(response2.body.token);
            // Both tokens should be valid
            expect(response1.body.token).toBeDefined();
            expect(response2.body.token).toBeDefined();
        });
        it('should include proper token expiration', async () => {
            const userData = {
                userName: 'tokentest',
                firstName: 'Token',
                lastName: 'Test',
                phone: '1234567890',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                locationId: testLocation._id,
            };
            await request(app).post('/api/auth/signup').send(userData).expect(200);
            const response = await request(app)
                .post('/api/auth/login')
                .send({ userName: userData.userName, password: userData.password })
                .expect(200);
            const decoded = jwt.verify(response.body.token, process.env.SECRET || 'test-secret');
            // Token should have expiration
            expect(decoded.exp).toBeDefined();
            expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
            // Token should contain user ID
            expect(decoded._id).toBeDefined();
        });
    });
    describe('Error Handling', () => {
        it('should handle malformed JSON gracefully', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send('{"invalid": json}')
                .set('Content-Type', 'application/json');
            // Should handle malformed JSON without crashing
            expect([400, 500]).toContain(response.status);
        });
        it('should handle empty request body', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({})
                .expect(400);
            expect(response.body.error).toBe('All fields must be filled');
        });
        it('should handle very long usernames', async () => {
            const userData = {
                userName: 'a'.repeat(1000), // Very long username
                firstName: 'Test',
                lastName: 'User',
                phone: '1234567890',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                locationId: testLocation._id,
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);
            // Should handle long usernames gracefully
            expect([400, 500]).toContain(response.status);
        });
    });
    describe('Performance Tests', () => {
        it('should handle multiple concurrent requests', async () => {
            const userData = {
                userName: 'concurrentuser',
                firstName: 'Concurrent',
                lastName: 'User',
                phone: '1234567890',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                locationId: testLocation._id,
            };
            // Create user first
            await request(app).post('/api/auth/signup').send(userData).expect(200);
            // Create multiple concurrent login requests
            const requests = Array(5)
                .fill(null)
                .map(() => request(app).post('/api/auth/login').send({
                userName: userData.userName,
                password: userData.password,
            }));
            const responses = await Promise.all(requests);
            // All should succeed
            responses.forEach((response) => {
                expect(response.status).toBe(200);
                expect(response.body.token).toBeDefined();
            });
        });
    });
});
export {};
