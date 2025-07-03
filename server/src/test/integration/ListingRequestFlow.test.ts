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
    it('should create a listing and view it', async () => {
      // Step 1: Host creates a listing
      const listingData = {
        title: 'Amazing Italian Dinner',
        description: 'Join me for authentic Italian cuisine',
        category: 'dining',
        location: {
          place_id: testLocation.place_id,
          // Include other location fields as needed
          address: testLocation.address,
          name: testLocation.name,
          coordinates: testLocation.coordinates,
        },
        locationId: testLocation._id.toString(), // Include locationId as well
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

      // Note: We're skipping the request-related steps because those endpoints are not implemented
      // in the actual RequestRoutes.ts (which only has GET / and GET /nearby)
    });
  });
});
