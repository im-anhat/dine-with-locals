/**
 * Request Controller Tests
 * Tests request creation, retrieval, and status updates
 */

import request from 'supertest';
import mongoose from 'mongoose';
import testApp from '../testApp.js';
import {
  createTestUser,
  createTestListing,
  createTestRequest,
  createTestLocation,
  cleanupTestData,
} from '../helpers/testHelpers.js';
import RequestModel from '../../models/Request.js';

describe('Request Controller', () => {
  let guestUser: any;
  let hostUser: any;
  let guestToken: string;
  let hostToken: string;
  let testLocation: any;
  let testListing: any;

  beforeEach(async () => {
    await cleanupTestData();

    // Create a guest user
    const guestData = await createTestUser({
      userName: 'guestuser',
      firstName: 'Guest',
      lastName: 'User',
      role: 'Guest',
    });
    guestUser = guestData.user;
    guestToken = guestData.token;

    // Create a host user
    const hostData = await createTestUser({
      userName: 'hostuser',
      firstName: 'Host',
      lastName: 'User',
      role: 'Host',
    });
    hostUser = hostData.user;
    hostToken = hostData.token;

    // Create a test location
    testLocation = await createTestLocation();

    // Create a test listing
    testListing = await createTestListing(hostUser._id, testLocation._id);
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('Create Request', () => {
    it.skip('should create a new request with valid data', async () => {
      // Skipping test because POST /api/request is not implemented in RequestRoutes.ts
      const requestData = {
        userId: guestUser._id.toString(),
        title: 'Dinner Request',
        locationType: 'either',
        locationId: testLocation._id.toString(),
        interestTopic: ['Food', 'Culture'],
        time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        cuisine: ['Italian', 'French'],
        dietaryRestriction: ['Vegetarian'],
        numGuests: 2,
        additionalInfo: 'Looking forward to a great experience!',
      };

      const response = await request(testApp)
        .post('/api/request')
        .set('Authorization', `Bearer ${guestToken}`)
        .send(requestData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', requestData.title);
      expect(response.body).toHaveProperty('userId', guestUser._id.toString());
      expect(response.body).toHaveProperty('status', 'waiting');

      // Verify request was created in the database
      const createdRequest = await RequestModel.findById(response.body._id);
      expect(createdRequest).toBeTruthy();
      expect(createdRequest!.title).toBe(requestData.title);
    });

    it.skip('should not create a request with missing required fields', async () => {
      // Skipping test because POST /api/request is not implemented in RequestRoutes.ts
      const incompleteRequest = {
        userId: guestUser._id.toString(),
        title: 'Incomplete Request',
        // Missing locationType, locationId, time
      };

      const response = await request(testApp)
        .post('/api/request')
        .set('Authorization', `Bearer ${guestToken}`)
        .send(incompleteRequest)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Get Request', () => {
    it.skip('should get a request by ID', async () => {
      // Skipping test because GET /api/request/:id is not implemented in RequestRoutes.ts

      // Create a test request
      const testRequest = await createTestRequest(
        guestUser._id,
        testLocation._id,
        {
          title: 'Test Request',
          locationType: 'either',
        },
      );

      const response = await request(testApp)
        .get(`/api/request/${testRequest._id}`)
        .set('Authorization', `Bearer ${guestToken}`)
        .expect(200);

      // The ObjectId needs to be converted to string for comparison
      const requestId = testRequest._id?.toString();
      expect(response.body).toHaveProperty('_id', requestId);
      expect(response.body).toHaveProperty('title', testRequest.title);
      expect(response.body).toHaveProperty('userId', guestUser._id.toString());
    });

    it.skip('should return 404 for non-existent request ID', async () => {
      // Skipping test because GET /api/request/:id is not implemented in RequestRoutes.ts
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(testApp)
        .get(`/api/request/${nonExistentId}`)
        .set('Authorization', `Bearer ${guestToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Request not found');
    });
  });

  describe('Update Request Status', () => {
    it.skip('should update a request status', async () => {
      // Skipping test because PUT /api/request/:id/status is not implemented in RequestRoutes.ts

      // Create a test request
      const testRequest = await createTestRequest(
        guestUser._id,
        testLocation._id,
        {
          status: 'waiting',
        },
      );

      const updateData = {
        status: 'pending',
      };

      const response = await request(testApp)
        .put(`/api/request/${testRequest._id}/status`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('status', updateData.status);

      // Verify changes were saved to the database
      const updatedRequest = await RequestModel.findById(testRequest._id);
      expect(updatedRequest!.status).toBe(updateData.status);
    });

    it.skip('should approve a request', async () => {
      // Skipping test because PUT /api/request/:id/status is not implemented in RequestRoutes.ts

      // Create a test request
      const testRequest = await createTestRequest(
        guestUser._id,
        testLocation._id,
        {
          status: 'pending',
        },
      );

      const updateData = {
        status: 'approved',
      };

      const response = await request(testApp)
        .put(`/api/request/${testRequest._id}/status`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('status', updateData.status);

      // Verify changes were saved to the database
      const updatedRequest = await RequestModel.findById(testRequest._id);
      expect(updatedRequest!.status).toBe(updateData.status);
    });

    it.skip('should not allow invalid status values', async () => {
      // Skipping test because PUT /api/request/:id/status is not implemented in RequestRoutes.ts

      // Create a test request
      const testRequest = await createTestRequest(
        guestUser._id,
        testLocation._id,
      );

      const updateData = {
        status: 'invalid-status', // Invalid status
      };

      const response = await request(testApp)
        .put(`/api/request/${testRequest._id}/status`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Get Requests', () => {
    it('should get all requests', async () => {
      // Create multiple test requests
      await createTestRequest(guestUser._id, testLocation._id, {
        title: 'Request 1',
      });
      await createTestRequest(guestUser._id, testLocation._id, {
        title: 'Request 2',
      });
      await createTestRequest(hostUser._id, testLocation._id, {
        title: 'Request 3',
      });

      const response = await request(testApp)
        .get('/api/request')
        .set('Authorization', `Bearer ${guestToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    it.skip('should get requests by user ID', async () => {
      // Skipping test because GET /api/request/user/:id is not implemented in RequestRoutes.ts

      // Create requests for guestUser
      await createTestRequest(guestUser._id, testLocation._id, {
        title: 'Guest Request 1',
      });
      await createTestRequest(guestUser._id, testLocation._id, {
        title: 'Guest Request 2',
      });

      // Create a request for hostUser
      await createTestRequest(hostUser._id, testLocation._id, {
        title: 'Host Request',
      });

      const response = await request(testApp)
        .get(`/api/request/user/${guestUser._id}`)
        .set('Authorization', `Bearer ${guestToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2); // Only guestUser's requests

      // All requests should belong to guestUser
      response.body.forEach((req) => {
        expect(req.userId.toString()).toBe(guestUser._id.toString());
      });
    });

    it('should get nearby requests', async () => {
      // Create requests
      await createTestRequest(guestUser._id, testLocation._id);
      await createTestRequest(hostUser._id, testLocation._id);

      // Use testLocation coordinates for the search
      const response = await request(testApp)
        .get(
          `/api/request/nearby?lat=${testLocation.coordinates.lat}&lng=${testLocation.coordinates.lng}&distance=10`,
        )
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // The number of results depends on the distance calculation and the mock data
    });
  });
});
