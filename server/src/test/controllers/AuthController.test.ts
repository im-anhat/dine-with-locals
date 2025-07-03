/**
 * Auth Controller Tests
 * Tests authentication functionality including signup, login, and JWT token verification
 */

import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import testApp from '../testApp.js';
import { cleanupTestData } from '../helpers/testHelpers.js';

describe('Auth Controller', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('User Registration', () => {
    it('should register a new user with valid credentials', async () => {
      // Prepare test user data
      const userData = {
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: 'TestPassword123!',
        phone: '1234567890',
        role: 'Guest',
      };

      const response = await request(testApp)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('userName', userData.userName);
      expect(response.body.user).toHaveProperty(
        'firstName',
        userData.firstName,
      );
      expect(response.body.user).toHaveProperty('lastName', userData.lastName);
      expect(response.body.user).not.toHaveProperty('password');

      // Verify user was created in the database
      const createdUser = await User.findOne({ userName: userData.userName });
      expect(createdUser).toBeTruthy();
      expect(createdUser!.firstName).toBe(userData.firstName);
    });

    it('should not register a user with an existing username', async () => {
      // Create a location first
      const location = await mongoose.model('Location').create({
        address: '123 Test St',
        city: 'Test City',
        state: 'CA',
        country: 'USA',
        zipCode: '12345',
        coordinates: {
          lat: 37.7749,
          lng: -122.4194,
        },
      });

      // Create a user first
      const existingUser = new User({
        userName: 'existinguser',
        firstName: 'Existing',
        lastName: 'User',
        password: await bcrypt.hash('Password123!', 10),
        phone: '0987654321',
        role: 'Guest',
        provider: 'Local',
        locationId: location._id,
      });

      await existingUser.save();

      // Try to register with the same username
      const userData = {
        userName: 'existinguser',
        firstName: 'New',
        lastName: 'User',
        password: 'Password123!',
        phone: '1234567890',
        role: 'Host',
      };

      const response = await request(testApp)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('already in use');
    });

    it('should not register a user with missing required fields', async () => {
      const incompleteUserData = {
        userName: 'incompleteuser',
        firstName: 'Incomplete',
        // Missing lastName, password, role
      };

      const response = await request(testApp)
        .post('/api/auth/register')
        .send(incompleteUserData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('User Login', () => {
    it('should login a user with valid credentials', async () => {
      // Create a location first
      const location = await mongoose.model('Location').create({
        address: '123 Test St',
        city: 'Test City',
        state: 'CA',
        country: 'USA',
        zipCode: '12345',
        coordinates: {
          lat: 37.7749,
          lng: -122.4194,
        },
      });

      // Create a test user
      const password = 'TestPassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);

      const testUser = new User({
        userName: 'loginuser',
        firstName: 'Login',
        lastName: 'User',
        password: hashedPassword,
        phone: '1234567890',
        role: 'Guest',
        provider: 'Local',
        locationId: location._id,
      });

      await testUser.save();

      // Login with created user
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          userName: 'loginuser',
          password: password,
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
      expect(loginResponse.body).toHaveProperty('user');
      expect(loginResponse.body.user).toHaveProperty('userName', 'loginuser');
      expect(loginResponse.body.user).not.toHaveProperty('password');

      // Verify token
      const decodedToken = jwt.verify(
        loginResponse.body.token,
        process.env.SECRET || 'test-secret',
      ) as any;
      expect(decodedToken).toHaveProperty('_id', testUser._id.toString());
    });

    it('should not login with incorrect password', async () => {
      // Create a location first
      const location = await mongoose.model('Location').create({
        address: '123 Test St',
        city: 'Test City',
        state: 'CA',
        country: 'USA',
        zipCode: '12345',
        coordinates: {
          lat: 37.7749,
          lng: -122.4194,
        },
      });

      // Create a test user
      const hashedPassword = await bcrypt.hash('CorrectPassword123!', 10);

      const testUser = new User({
        userName: 'passworduser',
        firstName: 'Password',
        lastName: 'User',
        password: hashedPassword,
        phone: '1234567890',
        role: 'Guest',
        provider: 'Local',
        locationId: location._id,
      });

      await testUser.save();

      // Attempt login with wrong password
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          userName: 'passworduser',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(loginResponse.body).toHaveProperty('error');
      expect(loginResponse.body.error).toContain('Invalid credentials');
    });

    it('should not login with non-existent username', async () => {
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          userName: 'nonexistentuser',
          password: 'Password123!',
        })
        .expect(401);

      expect(loginResponse.body).toHaveProperty('error');
      expect(loginResponse.body.error).toContain('Invalid credentials');
    });
  });

  describe('Auth Middleware', () => {
    it('should reject requests with invalid token', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid or Expired token');
    });

    it('should reject requests with missing token', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Token missing');
    });
  });
});
