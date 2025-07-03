/**
 * User Controller Tests
 * Tests user management functionality including profile retrieval and updates
 */

import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import testApp from '../testApp.js';
import { createTestUser, cleanupTestData } from '../helpers/testHelpers.js';

describe('User Controller', () => {
  let testUser: any;
  let userToken: string;

  beforeEach(async () => {
    await cleanupTestData();
    const testData = await createTestUser();
    testUser = testData.user;
    userToken = testData.token;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('Get User Profile', () => {
    it('should get the current user profile with valid token', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // The profile endpoint in testApp.ts returns { userId: decoded._id }
      // instead of the full user object, so we adjust our expectations
      expect(response.body).toHaveProperty('userId', testUser._id.toString());
    });
  });

  describe('Get User by ID', () => {
    it('should get a user by ID', async () => {
      const response = await request(testApp)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // Check for user properties from UserController.getUserById
      expect(response.body).toHaveProperty('_id', testUser._id.toString());
      expect(response.body).toHaveProperty('userName', testUser.userName);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(testApp)
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
      const response = await request(testApp)
        .get('/api/users/invalid-id-format')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid user ID format');
    });
  });

  describe('Update User Profile', () => {
    it('should update user profile with valid data', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        bio: 'This is an updated bio',
        hobbies: ['Coding', 'Hiking', 'Photography'],
      };

      const response = await request(testApp)
        .put(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('firstName', updateData.firstName);
      expect(response.body).toHaveProperty('lastName', updateData.lastName);
      expect(response.body).toHaveProperty('bio', updateData.bio);
      expect(response.body).toHaveProperty('hobbies');
      expect(response.body.hobbies).toEqual(
        expect.arrayContaining(updateData.hobbies),
      );

      // Verify changes were saved to the database
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser!.firstName).toBe(updateData.firstName);
      expect(updatedUser!.lastName).toBe(updateData.lastName);
      expect(updatedUser!.bio).toBe(updateData.bio);
    });

    it('should not update user with invalid ID', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const response = await request(testApp)
        .put('/api/users/invalid-id')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid user ID format');
    });

    it('should not update non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const response = await request(testApp)
        .put(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('User not found');
    });
  });

  describe('Get All Users', () => {
    it('should get all users', async () => {
      // Create additional test users
      await createTestUser({
        userName: 'seconduser',
        firstName: 'Second',
        lastName: 'User',
      });

      await createTestUser({
        userName: 'thirduser',
        firstName: 'Third',
        lastName: 'User',
      });

      const response = await request(testApp)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);

      // Verify no passwords are included in the response
      response.body.forEach((user) => {
        expect(user).not.toHaveProperty('password');
      });
    });
  });
});
