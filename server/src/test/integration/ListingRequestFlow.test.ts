/**
 * Integration Tests - Listing and Request Flow
 * Tests the core business flow from listing creation to request submission
 */

import request from 'supertest';
import testApp from '../testApp.js';
import User from '../../models/User.js';
import Listing from '../../models/Listing.js';
import RequestModel from '../../models/Request.js';
import jwt from 'jsonwebtoken';
import { createTestUser, createTestLocation } from '../helpers/testHelpers.js';

// Increase timeout for all tests in this file
jest.setTimeout(30000);

describe('Listing-Request Flow Integration Tests', () => {
  let hostUser: any;
  let guestUser: any;
  let hostToken: string;
  let guestToken: string;
  let testLocation: any;
  let testListing: any;

  beforeAll(async () => {
    // Create a host user
    const hostData = await createTestUser({
      userName: 'hostuser',
      firstName: 'Host',
      lastName: 'User',
      email: 'host@example.com',
      role: 'Host',
    });
    hostUser = hostData.user;

    // Create a guest user
    const guestData = await createTestUser({
      userName: 'guestuser',
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@example.com',
      role: 'Guest',
    });
    guestUser = guestData.user;

    // Generate tokens
    hostToken = jwt.sign(
      { _id: hostUser._id },
      process.env.SECRET || 'test-secret',
      { expiresIn: '1h' },
    );

    guestToken = jwt.sign(
      { _id: guestUser._id },
      process.env.SECRET || 'test-secret',
      { expiresIn: '1h' },
    );

    // Create a test location
    testLocation = hostData.location;
  });

  describe('End-to-End Flow', () => {
    it('should create a listing, view it, and submit a request', async () => {
      // Step 1: Host creates a listing
      const listingData = {
        title: 'Amazing Italian Dinner',
        description: 'Join me for authentic Italian cuisine',
        category: 'dining',
        locationId: testLocation._id.toString(),
        time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        duration: 120,
        numGuests: 4,
        cuisine: ['Italian'],
        dietary: ['Vegetarian', 'Gluten-Free'],
        userId: hostUser._id.toString(),
      };

      const createListingResponse = await request(testApp)
        .post('/api/listing')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(listingData)
        .expect(201);

      expect(createListingResponse.body).toHaveProperty('listing');
      expect(createListingResponse.body.listing).toHaveProperty('_id');
      testListing = createListingResponse.body.listing;

      // Step 2: Guest views the listing
      const viewListingResponse = await request(testApp)
        .get(`/api/listing/${testListing._id}`)
        .set('Authorization', `Bearer ${guestToken}`)
        .expect(200);

      expect(viewListingResponse.body).toHaveProperty(
        'title',
        listingData.title,
      );

      // Step 3: Guest submits a request for the listing
      const requestData = {
        title: 'Request for Italian Dinner',
        locationType: 'either',
        locationId: testLocation._id.toString(),
        time: listingData.time,
        cuisine: ['Italian'],
        dietaryRestriction: ['Vegetarian'],
        numGuests: 2,
        additionalInfo: 'I would love to join your dinner!',
        userId: guestUser._id.toString(),
        status: 'waiting',
      };

      const submitRequestResponse = await request(testApp)
        .post('/api/request')
        .set('Authorization', `Bearer ${guestToken}`)
        .send(requestData)
        .expect(201);

      expect(submitRequestResponse.body).toHaveProperty('_id');

      const requestId = submitRequestResponse.body._id;

      // Step 4: Host views the request
      const viewRequestResponse = await request(testApp)
        .get(`/api/request/${requestId}`)
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(200);

      expect(viewRequestResponse.body).toHaveProperty('_id', requestId);
      expect(viewRequestResponse.body).toHaveProperty('status', 'waiting');

      // Step 5: Host updates the request status to pending
      const updateToPendingResponse = await request(testApp)
        .put(`/api/request/${requestId}/status`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send({ status: 'pending' })
        .expect(200);

      expect(updateToPendingResponse.body).toHaveProperty('status', 'pending');

      // Step 6: Host approves the request
      const approveRequestResponse = await request(testApp)
        .put(`/api/request/${requestId}/status`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send({ status: 'approved' })
        .expect(200);

      expect(approveRequestResponse.body).toHaveProperty('status', 'approved');

      // Verify final state in database
      const updatedRequest = await RequestModel.findById(requestId);
      expect(updatedRequest).toHaveProperty('status', 'approved');
    });
  });
});
