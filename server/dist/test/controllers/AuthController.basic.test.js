const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createTestApp } = require('../testApp');
describe('AuthController Basic Tests', () => {
    let app;
    let UserModel;
    let LocationModel;
    let testLocation;
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
        if (UserModel) {
            await UserModel.deleteMany({ userName: { $regex: /^test/ } });
        }
        if (LocationModel) {
            await LocationModel.deleteMany({ city: { $regex: /^Test/ } });
        }
        // Create a test location for user creation
        testLocation = await LocationModel.create({
            city: 'Test City',
            state: 'Test State',
            country: 'Test Country',
        });
    });
    afterAll(async () => {
        // Clean up test data
        if (UserModel) {
            await UserModel.deleteMany({ userName: { $regex: /^test/ } });
        }
        if (LocationModel) {
            await LocationModel.deleteMany({ city: { $regex: /^Test/ } });
        }
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
            expect(user.firstName).toBe(userData.firstName);
            expect(user.lastName).toBe(userData.lastName);
            // Verify password was hashed
            expect(user.password).not.toBe(userData.password);
            const isPasswordValid = await bcrypt.compare(userData.password, user.password);
            expect(isPasswordValid).toBe(true);
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
            // Create a user first
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('testPassword123', salt);
            await UserModel.create({
                userName: 'duplicateuser',
                firstName: 'First',
                lastName: 'User',
                phone: '1234567890',
                password: hashedPassword,
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                provider: 'email',
                locationId: testLocation._id,
            });
            // Try to create another user with same username
            const duplicateUser = {
                userName: 'duplicateuser',
                firstName: 'Second',
                lastName: 'User',
                phone: '0987654321',
                password: 'anotherPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar2.jpg',
                cover: 'https://example.com/cover2.jpg',
                locationId: testLocation._id,
            };
            const response = await request(app)
                .post('/api/auth/signup')
                .send(duplicateUser)
                .expect(400);
            expect(response.body.Error).toBe('Username already in use');
        });
    });
    describe('POST /api/auth/login', () => {
        let testUser;
        beforeEach(async () => {
            // Create a test user for login tests
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('testPassword123', salt);
            testUser = await UserModel.create({
                userName: 'loginuser',
                firstName: 'Test',
                lastName: 'User',
                phone: '1234567890',
                password: hashedPassword,
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                provider: 'email',
                locationId: testLocation._id,
            });
        });
        it('should login user with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: 'loginuser',
                password: 'testPassword123',
            })
                .expect(200);
            expect(response.body.message).toBe('Login Successful');
            expect(response.body.token).toBeDefined();
            // Verify token is valid
            const decoded = jwt.verify(response.body.token, process.env.SECRET || 'test-secret');
            expect(decoded._id).toBe(testUser._id.toString());
        });
        it('should reject login with missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: 'loginuser',
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
                password: 'testPassword123',
            })
                .expect(400);
            expect(response.body.error).toBe('Username not found');
        });
        it('should reject login with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                userName: 'loginuser',
                password: 'wrongpassword',
            })
                .expect(400);
            expect(response.body.error).toBe('Incorrect password');
        });
    });
    describe('Error Handling', () => {
        it('should handle malformed JSON gracefully', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send('invalid json')
                .set('Content-Type', 'application/json');
            // Should not crash the server
            expect([400, 500]).toContain(response.status);
        });
    });
    describe('Security Tests', () => {
        it('should not expose password in database', async () => {
            const userData = {
                userName: 'securitytest',
                firstName: 'Security',
                lastName: 'Test',
                phone: '1234567890',
                password: 'testPassword123',
                role: 'Guest',
                avatar: 'https://example.com/avatar.jpg',
                cover: 'https://example.com/cover.jpg',
                locationId: testLocation._id,
            };
            await request(app).post('/api/auth/signup').send(userData).expect(200);
            const user = await UserModel.findOne({ userName: userData.userName });
            expect(user.password).not.toBe(userData.password);
            expect(user.password.length).toBeGreaterThan(10); // Should be hashed
        });
        it('should generate different tokens for different users', async () => {
            // Create two users
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('testPassword123', salt);
            await UserModel.create({
                userName: 'user1',
                firstName: 'User',
                lastName: 'One',
                phone: '1111111111',
                password: hashedPassword,
                role: 'Guest',
                avatar: 'https://example.com/avatar1.jpg',
                cover: 'https://example.com/cover1.jpg',
                provider: 'email',
                locationId: testLocation._id,
            });
            await UserModel.create({
                userName: 'user2',
                firstName: 'User',
                lastName: 'Two',
                phone: '2222222222',
                password: hashedPassword,
                role: 'Guest',
                avatar: 'https://example.com/avatar2.jpg',
                cover: 'https://example.com/cover2.jpg',
                provider: 'email',
                locationId: testLocation._id,
            });
            const response1 = await request(app).post('/api/auth/login').send({
                userName: 'user1',
                password: 'testPassword123',
            });
            const response2 = await request(app).post('/api/auth/login').send({
                userName: 'user2',
                password: 'testPassword123',
            });
            expect(response1.body.token).not.toBe(response2.body.token);
        });
    });
});
export {};
