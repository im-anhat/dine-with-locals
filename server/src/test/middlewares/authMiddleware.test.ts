import request from 'supertest';
import testApp from '../testApp';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import { createTestUser } from '../helpers/testHelpers';

describe('Authentication Middleware', () => {
  let testUser: any;
  let validToken: string;
  let expiredToken: string;
  let invalidToken: string;

  beforeEach(async () => {
    // Create test user
    const userData = await createTestUser({
      userName: 'authtest',
      firstName: 'Auth',
      lastName: 'Test',
      email: 'auth@example.com',
    });
    testUser = userData.user;

    // Generate valid JWT token
    validToken = jwt.sign(
      { _id: testUser._id, email: testUser.email },
      process.env.SECRET || 'test-secret',
      { expiresIn: '1h' },
    );

    // Generate expired JWT token
    expiredToken = jwt.sign(
      { _id: testUser._id, email: testUser.email },
      process.env.SECRET || 'test-secret',
      { expiresIn: '-1h' }, // Already expired
    );

    // Invalid token
    invalidToken = 'invalid.jwt.token';
  });

  describe('Protected Routes Authentication', () => {
    it('should allow access with valid token', async () => {
      // Test with a protected route that requires authentication
      const response = await request(testApp)
        .get('/api/users/profile') // Assuming this route requires auth
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Should not return authentication error
      expect(response.body.message).not.toBe('Token missing');
      expect(response.body.message).not.toBe('Invalid or Expired token');
    });

    it('should reject requests without token', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.message).toBe('Token missing');
    });

    it('should reject requests with malformed Authorization header', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', 'InvalidFormat')
        .expect(401);

      expect(response.body.message).toBe('Token missing');
    });

    it('should reject requests with missing Bearer prefix', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', validToken) // Missing "Bearer " prefix
        .expect(401);

      expect(response.body.message).toBe('Token missing');
    });

    it('should reject requests with expired token', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });

    it('should reject requests with token signed with wrong secret', async () => {
      const wrongSecretToken = jwt.sign(
        { _id: testUser._id, email: testUser.email },
        'wrong-secret', // Different secret
        { expiresIn: '1h' },
      );

      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${wrongSecretToken}`)
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });

    it('should reject requests with token for non-existent user', async () => {
      // Delete the user but keep the token
      await User.findByIdAndDelete(testUser._id);

      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });

    it('should attach user data to request object', async () => {
      // Create a test endpoint that returns user data from request object
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // The response should contain user data (excluding password)
      expect(response.body.userName).toBe(testUser.userName);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.password).toBeUndefined();
    });

    it('should handle empty Authorization header', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', '')
        .expect(401);

      expect(response.body.message).toBe('Token missing');
    });

    it('should handle Authorization header with only Bearer', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer ')
        .expect(401);

      expect(response.body.message).toBe('Token missing');
    });

    it('should handle multiple spaces in Authorization header', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer  ${validToken}`) // Extra space
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });
  });

  describe('Token Security Validation', () => {
    it('should reject token with invalid payload structure', async () => {
      const invalidPayloadToken = jwt.sign(
        { invalidField: 'value' }, // Missing required _id and email
        process.env.SECRET || 'test-secret',
        { expiresIn: '1h' },
      );

      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${invalidPayloadToken}`)
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });

    it('should handle very long tokens', async () => {
      // Create a token with a very long payload
      const longPayload = {
        _id: testUser._id,
        email: testUser.email,
        extraData: 'x'.repeat(1000), // Very long string
      };

      const longToken = jwt.sign(
        longPayload,
        process.env.SECRET || 'test-secret',
        { expiresIn: '1h' },
      );

      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${longToken}`)
        .expect(200);

      // Should still work with long tokens
      expect(response.body.userName).toBe(testUser.userName);
    });

    it('should handle token with null or undefined values', async () => {
      const nullValueToken = jwt.sign(
        { _id: null, email: testUser.email },
        process.env.SECRET || 'test-secret',
        { expiresIn: '1h' },
      );

      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${nullValueToken}`)
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });

    it('should handle concurrent requests with same token', async () => {
      // Make multiple concurrent requests with the same token
      const promises = Array(5)
        .fill(null)
        .map(() =>
          request(testApp)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${validToken}`),
        );

      const responses = await Promise.all(promises);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.userName).toBe(testUser.userName);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed JWT tokens', async () => {
      const malformedTokens = [
        'not.a.jwt',
        'header.payload', // Missing signature
        '.payload.signature', // Missing header
        'header..signature', // Missing payload
        'header.payload.signature.extra', // Too many parts
        '', // Empty string
        'just-a-string', // Not JWT format
      ];

      for (const token of malformedTokens) {
        const response = await request(testApp)
          .get('/api/users/profile')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        expect(response.body.message).toBe('Invalid or Expired token');
      }
    });

    it('should handle very short expiration times', async () => {
      const shortLivedToken = jwt.sign(
        { _id: testUser._id, email: testUser.email },
        process.env.SECRET || 'test-secret',
        { expiresIn: '1ms' }, // Very short expiration
      );

      // Wait a bit to ensure token expires
      await new Promise((resolve) => setTimeout(resolve, 10));

      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${shortLivedToken}`)
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });

    it('should handle tokens without expiration', async () => {
      const noExpirationToken = jwt.sign(
        { _id: testUser._id, email: testUser.email },
        process.env.SECRET || 'test-secret',
        // No expiresIn option
      );

      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${noExpirationToken}`)
        .expect(200);

      expect(response.body.userName).toBe(testUser.userName);
    });

    it('should handle case-insensitive Bearer prefix', async () => {
      // Note: This test assumes the middleware is case-sensitive
      // which is the correct behavior for security
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `bearer ${validToken}`) // lowercase 'bearer'
        .expect(401);

      expect(response.body.message).toBe('Token missing');
    });

    it('should handle special characters in Authorization header', async () => {
      const specialCharTokens = [
        `Bearer ${validToken}@`,
        `Bearer ${validToken}#`,
        `Bearer ${validToken}%`,
        `Bearer ${validToken}&`,
      ];

      for (const token of specialCharTokens) {
        const response = await request(testApp)
          .get('/api/users/profile')
          .set('Authorization', token)
          .expect(403);

        expect(response.body.message).toBe('Invalid or Expired token');
      }
    });
  });

  describe('Security Best Practices', () => {
    it('should not expose sensitive error details', async () => {
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(403);

      // Should not expose internal error details
      expect(response.body.message).toBe('Invalid or Expired token');
      expect(response.body.stack).toBeUndefined();
      expect(response.body.error).toBeUndefined();
    });

    it('should use secure defaults', async () => {
      // Test that middleware uses secure configuration
      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Verify password is excluded from user data
      expect(response.body.password).toBeUndefined();
    });

    it('should handle different algorithm attacks', async () => {
      // Create token with 'none' algorithm (security vulnerability)
      const noneAlgToken = jwt.sign(
        { _id: testUser._id, email: testUser.email },
        '', // Empty secret for 'none' algorithm
        { algorithm: 'none' as any },
      );

      const response = await request(testApp)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${noneAlgToken}`)
        .expect(403);

      expect(response.body.message).toBe('Invalid or Expired token');
    });
  });
});
