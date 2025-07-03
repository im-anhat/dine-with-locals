const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createTestApp } = require('../testApp');
describe('AuthController Tests', () => {
    let app;
    let testLocation;
    let UserModel;
    let LocationModel;
    beforeAll(async () => {
        // Use test app instead of main app to avoid port conflicts
        app = createTestApp();
        const userModule = await import('../../models/User.js');
        UserModel = userModule.default;
        const locationModule = await import('../../models/Location.js');
        LocationModel = locationModule.default;
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
        await LocationModel.deleteMany({ city: { $regex: /^Test/ } });
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
        it('should reject signup with missing fields', async () => {
            const incompleteUser = {
                userName: 'testuser',
                // Missing required fields
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(incompleteUser)
                .expect(400);
            expect(response.body.Error).toBeDefined();
        });
        it('should reject signup with duplicate username', async () => {
            // Create the first user
            const userData = {
                userName: 'duplicateuser',
                firstName: 'First',
                lastName: 'User',
                phone: '1234567890',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
            };
            await request(app).post('/api/auth/signup').send(userData).expect(200);
            // Try to create another user with same username
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
                userName: 'testuser',
                firstName: 'Test',
                password: 'short', // This might cause validation errors
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(invalidUser)
                .expect(400);
            expect(response.body.Error).toBeDefined();
        });
    });
    describe('POST /api/auth/login', () => {
        let testUser;
        const userData = {
            userName: 'logintest',
            firstName: 'Login',
            lastName: 'Test',
            phone: '1234567890',
            password: 'testPassword123',
            role: 'Guest',
            avatar: 'https://example.com/avatar.jpg',
            cover: 'https://example.com/cover.jpg',
        };
        beforeEach(async () => {
            // Create test user for login tests
            await request(app).post('/api/auth/signup').send(userData).expect(200);
            testUser = await UserModel.findOne({ userName: userData.userName });
        });
        it('should login user with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: userData.userName,
                password: userData.password,
            })
                .expect(200);
            expect(response.body.message).toBe('Login Successful');
            expect(response.body.token).toBeDefined();
            // Verify token is valid
            const decoded = jwt.verify(response.body.token, process.env.SECRET || 'test-secret');
            expect(decoded._id).toBe(testUser._id.toString());
        });
        it('should reject login with missing password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: userData.userName,
                // Missing password
            })
                .expect(400);
            expect(response.body.error).toBe('All fields must be filled');
        });
        it('should reject login with missing username', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                password: userData.password,
                // Missing userName
            })
                .expect(400);
            expect(response.body.error).toBe('All fields must be filled');
        });
        it('should reject login with non-existent username', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: 'nonexistentuser',
                password: userData.password,
            })
                .expect(400);
            expect(response.body.error).toBe('Username not found');
        });
        it('should reject login with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: userData.userName,
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
    describe('POST /api/auth/google', () => {
        it('should handle missing credential', async () => {
            const response = await request(app)
                .post('/api/auth/google')
                .send({})
                .expect(400);
            expect(response.body.error).toBeDefined();
        });
        it('should handle invalid credential format', async () => {
            const response = await request(app)
                .post('/api/auth/google')
                .send({
                credential: 'invalid-token-format',
            })
                .expect(400);
            expect(response.body.error).toBeDefined();
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
        it('should handle server errors gracefully', async () => {
            // Test with invalid ObjectId format
            const invalidData = {
                userName: 'testuser',
                firstName: 'Test',
                lastName: 'User',
                password: 'testPassword123',
                locationId: 'invalid-object-id',
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(invalidData);
            // Should not crash, should return proper error
            expect([400, 500]).toContain(response.status);
            expect(response.body.Error).toBeDefined();
        });
        it('should handle malformed JSON', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send('{"invalid": json}')
                .set('Content-Type', 'application/json');
            // Should handle malformed JSON gracefully
            expect([400, 500]).toContain(response.status);
        });
    });
});
export {};
