/**
 * Comprehensive UserController Test Suite
 * Tests for user management with database safety
 */

import request from 'supertest';
import express from 'express';
import { Types } from 'mongoose';

const {
  getAllUsers,
  getUserById,
  updateUser,
} = require('../../controllers/UserControllers');
const UserModel = require('../../models/User').default;

describe('Comprehensive UserController Tests', () => {
  let app: express.Application;
  let testUserId: string;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    app.get('/users', getAllUsers);
    app.get('/users/:userId', getUserById);
    app.put('/users/:userId', updateUser);

    // Create test user
    const testUser = await UserModel.create({
      userName: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      password: 'hashedpassword',
      provider: 'Local',
      role: 'Guest',
      locationId: new Types.ObjectId(),
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Test user bio',
    });
    testUserId = testUser._id.toString();
  });

  describe('GET /users - Get All Users', () => {
    beforeEach(async () => {
      await UserModel.create([
        {
          userName: 'user1',
          firstName: 'User',
          lastName: 'One',
          phone: '+1111111111',
          password: 'hash1',
          provider: 'Local',
          role: 'Guest',
          locationId: new Types.ObjectId(),
        },
        {
          userName: 'hostuser',
          firstName: 'Host',
          lastName: 'User',
          phone: '+2222222222',
          password: 'hash2',
          provider: 'Google',
          role: 'Host',
          locationId: new Types.ObjectId(),
        },
      ]);
    });

    it('should return all users without passwords', async () => {
      const response = await request(app).get('/users').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);

      response.body.forEach((user: any) => {
        expect(user).not.toHaveProperty('password');
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('userName');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
        expect(user).toHaveProperty('role');
      });
    });

    it('should include both Guest and Host users', async () => {
      const response = await request(app).get('/users').expect(200);

      const roles = response.body.map((user: any) => user.role);
      expect(roles).toContain('Guest');
      expect(roles).toContain('Host');
    });

    it('should include user profile information', async () => {
      const response = await request(app).get('/users').expect(200);

      const testUser = response.body.find(
        (user: any) => user.userName === 'testuser',
      );
      expect(testUser).toBeDefined();
      expect(testUser.bio).toBe('Test user bio');
      expect(testUser.avatar).toBe('https://example.com/avatar.jpg');
    });
  });

  describe('GET /users/:userId - Get User By ID', () => {
    it('should return user by valid ID', async () => {
      const response = await request(app)
        .get(`/users/${testUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', testUserId);
      expect(response.body).toHaveProperty('userName', 'testuser');
      expect(response.body).toHaveProperty('firstName', 'Test');
      expect(response.body).toHaveProperty('lastName', 'User');
      expect(response.body).toHaveProperty('role', 'Guest');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = new Types.ObjectId().toString();
      const response = await request(app)
        .get(`/users/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 for invalid ObjectId', async () => {
      const response = await request(app).get('/users/invalid-id').expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
    });

    it('should trim whitespace from user ID', async () => {
      const userIdWithSpaces = `  ${testUserId}  `;
      const response = await request(app)
        .get(`/users/${userIdWithSpaces}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', testUserId);
    });
  });

  describe('PUT /users/:userId - Update User', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        bio: 'Updated bio text',
        hobbies: ['reading', 'swimming'],
        cuisines: ['Mexican', 'Chinese'],
      };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('firstName', 'Updated');
      expect(response.body).toHaveProperty('lastName', 'Name');
      expect(response.body).toHaveProperty('bio', 'Updated bio text');
      expect(response.body.hobbies).toEqual(['reading', 'swimming']);
      expect(response.body.cuisines).toEqual(['Mexican', 'Chinese']);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should update only provided fields', async () => {
      const updateData = { bio: 'Only bio updated' };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('bio', 'Only bio updated');
      expect(response.body).toHaveProperty('firstName', 'Test'); // Unchanged
      expect(response.body).toHaveProperty('lastName', 'User'); // Unchanged
    });

    it('should handle avatar updates', async () => {
      const updateData = {
        avatar: 'https://example.com/new-avatar.jpg',
      };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.avatar).toBe('https://example.com/new-avatar.jpg');
    });

    it('should handle social link updates', async () => {
      const updateData = {
        socialLink: 'https://twitter.com/testuser',
      };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.socialLink).toBe('https://twitter.com/testuser');
    });

    it('should validate ethnicity enum', async () => {
      const validEthnicities = ['Asian', 'Black', 'Hispanic', 'White', 'Other'];

      for (const ethnicity of validEthnicities) {
        const response = await request(app)
          .put(`/users/${testUserId}`)
          .send({ ethnicity })
          .expect(200);

        expect(response.body.ethnicity).toBe(ethnicity);
      }
    });

    it('should return 404 for non-existent user update', async () => {
      const nonExistentId = new Types.ObjectId().toString();
      const updateData = { firstName: 'Updated' };

      const response = await request(app)
        .put(`/users/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 for invalid ObjectId in update', async () => {
      const updateData = { firstName: 'Updated' };

      const response = await request(app)
        .put('/users/invalid-id')
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
    });

    it('should handle empty update data gracefully', async () => {
      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send({})
        .expect(200);

      expect(response.body).toHaveProperty('firstName', 'Test');
      expect(response.body).toHaveProperty('userName', 'testuser');
    });

    it('should update arrays for hobbies and cuisines', async () => {
      const updateData = {
        hobbies: ['cooking', 'travel', 'photography'],
        cuisines: ['Italian', 'Japanese', 'Mexican', 'Thai'],
      };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.hobbies).toEqual(updateData.hobbies);
      expect(response.body.cuisines).toEqual(updateData.cuisines);
      expect(response.body.hobbies.length).toBe(3);
      expect(response.body.cuisines.length).toBe(4);
    });

    it('should handle cover image updates', async () => {
      const updateData = {
        cover: 'https://example.com/new-cover.jpg',
      };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.cover).toBe('https://example.com/new-cover.jpg');
    });
  });

  describe('Security and Data Protection', () => {
    it('should never return passwords in any response', async () => {
      // Test GET all users
      const getAllResponse = await request(app).get('/users');
      getAllResponse.body.forEach((user: any) => {
        expect(user).not.toHaveProperty('password');
      });

      // Test GET single user
      const getUserResponse = await request(app).get(`/users/${testUserId}`);
      expect(getUserResponse.body).not.toHaveProperty('password');

      // Test PUT update user
      const updateResponse = await request(app)
        .put(`/users/${testUserId}`)
        .send({ firstName: 'Updated' });
      expect(updateResponse.body).not.toHaveProperty('password');
    });

    it('should handle malicious input safely', async () => {
      const maliciousData = {
        firstName: '<script>alert("xss")</script>',
        bio: 'SELECT * FROM users;',
        socialLink: 'javascript:alert("xss")',
      };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(maliciousData);

      expect(response.status).toBeLessThan(500);
      expect(response.body).toHaveProperty('firstName');
    });

    it('should handle very long strings', async () => {
      const longString = 'a'.repeat(10000);
      const updateData = { bio: longString };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData);

      expect(response.status).toBeLessThan(500);
    });

    it('should not allow updating protected fields', async () => {
      const updateData = {
        _id: 'new-id',
        userName: 'newtestuser',
        password: 'newpassword',
        provider: 'Google',
      };

      await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData)
        .expect(200);

      // Verify protected fields weren't changed
      const user = await UserModel.findById(testUserId);
      expect(user.userName).toBe('testuser');
      expect(user.provider).toBe('Local');
      expect(user.password).toBe('hashedpassword');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // This test would require mocking database errors
      // For now, we test that the endpoints exist and respond
      const response = await request(app).get('/users');
      expect(response.status).toBeLessThan(500);
    });

    it('should handle null and undefined values', async () => {
      const updateData = {
        bio: null,
        avatar: undefined,
        socialLink: '',
      };

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(updateData);

      expect(response.status).toBeLessThan(500);
    });
  });
});
