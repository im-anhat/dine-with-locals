/**
 * Listing Controller Tests
 * Tests listing creation, retrieval, and modification
 */

import request from 'supertest';
import mongoose from 'mongoose';
import testApp from '../testApp.js';
import {
  createTestUser,
  createTestListing,
  createTestLocation,
  cleanupTestData,
} from '../helpers/testHelpers.js';
import Listing from '../../models/Listing.js';

describe('Listing Controller', () => {
  let testUser: any;
  let hostUser: any;
  let userToken: string;
  let hostToken: string;
  let testLocation: any;

  beforeEach(async () => {
    await cleanupTestData();

    // Create a regular user
    const userData = await createTestUser({
      userName: 'regularuser',
      firstName: 'Regular',
      lastName: 'User',
      role: 'Guest',
    });
    testUser = userData.user;
    userToken = userData.token;

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
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('Create Listing', () => {
    it('should create a new listing with valid data', async () => {
      const listingData = {
        userId: hostUser._id.toString(),
        title: 'Amazing Italian Dinner',
        description: 'Join me for authentic Italian cuisine',
        category: 'dining',
        locationId: testLocation._id.toString(),
        time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        duration: 120, // 2 hours
        numGuests: 4,
        cuisine: ['Italian', 'Mediterranean'],
        dietary: ['Vegetarian', 'Gluten-Free'],
      };

      const response = await request(testApp)
        .post('/api/listing')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(listingData)
        .expect(201);

      expect(response.body).toHaveProperty(
        'message',
        'Listing created successfully',
      );
      expect(response.body).toHaveProperty('listing');
      expect(response.body.listing).toHaveProperty('title', listingData.title);
      expect(response.body.listing).toHaveProperty(
        'description',
        listingData.description,
      );
      expect(response.body.listing).toHaveProperty(
        'userId',
        hostUser._id.toString(),
      );

      // Verify listing was created in the database
      const createdListing = await Listing.findById(response.body.listing._id);
      expect(createdListing).toBeTruthy();
      expect(createdListing!.title).toBe(listingData.title);
    });

    it('should not create a listing with missing required fields', async () => {
      const incompleteListing = {
        userId: hostUser._id.toString(),
        title: 'Incomplete Listing',
        // Missing description, category, locationId
      };

      const response = await request(testApp)
        .post('/api/listing')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(incompleteListing)
        .expect(500); // Your controller returns 500 for validation errors

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Get Listing', () => {
    it('should get a listing by ID', async () => {
      // Create a test listing
      const testListing = await createTestListing(
        hostUser._id,
        testLocation._id,
        {
          title: 'Test Dinner Experience',
          description: 'Delicious homemade meals',
        },
      );

      const response = await request(testApp)
        .get(`/api/listing/${testListing._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', testListing._id.toString());
      expect(response.body).toHaveProperty('title', testListing.title);
      expect(response.body).toHaveProperty(
        'description',
        testListing.description,
      );
      expect(response.body).toHaveProperty('userId');
    });

    it('should return 404 for non-existent listing ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(testApp)
        .get(`/api/listing/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Listing not found');
    });

    it('should return 400 for invalid listing ID format', async () => {
      const response = await request(testApp)
        .get('/api/listing/invalid-id-format')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid listing ID format');
    });
  });

  describe('Update Listing', () => {
    it('should update a listing with valid data', async () => {
      // Create a test listing
      const testListing = await createTestListing(
        hostUser._id,
        testLocation._id,
        {
          title: 'Original Listing Title',
          description: 'Original description',
        },
      );

      const updateData = {
        title: 'Updated Listing Title',
        description: 'Updated description with more details',
        numGuests: 6,
        cuisine: ['Japanese', 'Fusion'],
      };

      const response = await request(testApp)
        .put(`/api/listing/${testListing._id}`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Listing updated successfully',
      );
      expect(response.body).toHaveProperty('listing');
      expect(response.body.listing).toHaveProperty('title', updateData.title);
      expect(response.body.listing).toHaveProperty(
        'description',
        updateData.description,
      );
      expect(response.body.listing).toHaveProperty(
        'numGuests',
        updateData.numGuests,
      );

      // Verify changes were saved to the database
      const updatedListing = await Listing.findById(testListing._id);
      expect(updatedListing!.title).toBe(updateData.title);
      expect(updatedListing!.description).toBe(updateData.description);
    });

    it('should not allow a non-owner to update a listing', async () => {
      // Create a test listing owned by hostUser
      const testListing = await createTestListing(
        hostUser._id,
        testLocation._id,
      );

      const updateData = {
        title: 'Unauthorized Update',
        description: 'This update should fail',
      };

      // Try to update using the regular user's token
      const response = await request(testApp)
        .put(`/api/listing/${testListing._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not authorized');
    });
  });

  describe('Delete Listing', () => {
    it('should delete a listing', async () => {
      // Create a test listing
      const testListing = await createTestListing(
        hostUser._id,
        testLocation._id,
      );

      const response = await request(testApp)
        .delete(`/api/listing/${testListing._id}`)
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Listing deleted successfully',
      );

      // Verify listing was deleted from the database
      const deletedListing = await Listing.findById(testListing._id);
      expect(deletedListing).toBeNull();
    });

    it('should not allow a non-owner to delete a listing', async () => {
      // Create a test listing owned by hostUser
      const testListing = await createTestListing(
        hostUser._id,
        testLocation._id,
      );

      // Try to delete using the regular user's token
      const response = await request(testApp)
        .delete(`/api/listing/${testListing._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not authorized');

      // Verify listing still exists in the database
      const listing = await Listing.findById(testListing._id);
      expect(listing).toBeTruthy();
    });
  });

  describe('Get Listings', () => {
    it('should get all listings', async () => {
      // Create multiple test listings
      await createTestListing(hostUser._id, testLocation._id, {
        title: 'Listing 1',
      });
      await createTestListing(hostUser._id, testLocation._id, {
        title: 'Listing 2',
      });
      await createTestListing(hostUser._id, testLocation._id, {
        title: 'Listing 3',
      });

      const response = await request(testApp)
        .get('/api/listing')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    it('should get listings by user ID', async () => {
      // Create listings for hostUser
      await createTestListing(hostUser._id, testLocation._id, {
        title: 'Host Listing 1',
      });
      await createTestListing(hostUser._id, testLocation._id, {
        title: 'Host Listing 2',
      });

      // Create a listing for testUser
      await createTestListing(testUser._id, testLocation._id, {
        title: 'User Listing',
      });

      const response = await request(testApp)
        .get(`/api/listing/user/${hostUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2); // Only hostUser's listings

      // All listings should belong to hostUser
      response.body.forEach((listing) => {
        expect(listing.userId.toString()).toBe(hostUser._id.toString());
      });
    });
  });
});
