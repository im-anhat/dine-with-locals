import request from 'supertest';
import testApp from '../testApp';
import User from '../../models/User';
import Listing from '../../models/Listing';
import Location from '../../models/Location';
import jwt from 'jsonwebtoken';
import { createTestUser, createTestLocation } from '../helpers/testHelpers';

describe('ListingController', () => {
  let testUser: any;
  let authToken: string;
  let testLocation: any;

  beforeEach(async () => {
    // Create test user
    const userData = await createTestUser({
      userName: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    });
    testUser = userData.user;

    // Generate JWT token
    authToken = jwt.sign(
      { _id: testUser._id, email: testUser.email },
      process.env.SECRET || 'test-secret',
      { expiresIn: '1h' },
    );

    // Create test location
    testLocation = await createTestLocation({
      place_id: 'test_place_123',
      name: 'Test Restaurant',
      address: '123 Test Street',
    });
  });

  describe('POST /api/listings', () => {
    it('should create a new listing successfully', async () => {
      const listingData = {
        userId: testUser._id.toString(),
        title: 'Amazing Italian Dinner',
        description: 'Join me for authentic Italian cuisine',
        category: 'dining',
        cuisine: ['Italian'],
        dietary: ['vegetarian-friendly'],
        numGuests: 4,
        time: new Date('2024-06-01T19:00:00Z'),
        duration: 120,
        location: {
          place_id: 'new_place_456',
          name: 'New Restaurant',
          address: '456 New Street',
          coordinates: {
            lat: 37.7849,
            lng: -122.4094,
          },
          types: ['restaurant'],
        },
      };

      const response = await request(testApp)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(listingData)
        .expect(201);

      expect(response.body.message).toBe('Listing created successfully');
      expect(response.body.listing).toBeDefined();
      expect(response.body.listing.title).toBe(listingData.title);
      expect(response.body.listing.userId.toString()).toBe(
        testUser._id.toString(),
      );
      expect(response.body.listing.locationId).toBeDefined();
    });

    it('should use existing location if place_id already exists', async () => {
      const listingData = {
        userId: testUser._id.toString(),
        title: 'Dinner at Existing Place',
        description: 'Join me at this great place',
        category: 'dining',
        location: {
          place_id: testLocation.place_id, // Use existing location
          name: 'Updated Name',
          address: 'Updated Address',
        },
      };

      const response = await request(testApp)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(listingData)
        .expect(201);

      expect(response.body.listing.locationId.toString()).toBe(
        testLocation._id.toString(),
      );

      // Verify location wasn't duplicated
      const locationCount = await Location.countDocuments({
        place_id: testLocation.place_id,
      });
      expect(locationCount).toBe(1);
    });

    it('should return 400 for invalid user ID format', async () => {
      const listingData = {
        userId: 'invalid-id',
        title: 'Test Listing',
        description: 'Test description',
        category: 'dining',
        location: {
          place_id: 'test_place',
          name: 'Test Place',
        },
      };

      const response = await request(testApp)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(listingData)
        .expect(400);

      expect(response.body.error).toBe('Invalid user ID format');
    });

    it('should return 500 for database errors', async () => {
      // Mock a database error by using invalid data
      const listingData = {
        userId: testUser._id.toString(),
        // Missing required fields to trigger error
        category: 'invalid-category',
        location: {
          place_id: 'test_place',
          name: 'Test Place',
        },
      };

      const response = await request(testApp)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(listingData)
        .expect(500);

      expect(response.body.error).toBe('Failed to create listing');
    });
  });

  describe('GET /api/listings/:listingId', () => {
    let testListing: any;

    beforeEach(async () => {
      testListing = new Listing({
        userId: testUser._id,
        title: 'Test Listing',
        description: 'Test description',
        category: 'dining',
        locationId: testLocation._id,
        status: 'pending',
      });
      await testListing.save();
    });

    it('should get listing by ID successfully', async () => {
      const response = await request(testApp)
        .get(`/api/listings/${testListing._id}`)
        .expect(200);

      expect(response.body._id.toString()).toBe(testListing._id.toString());
      expect(response.body.title).toBe(testListing.title);
      expect(response.body.userId).toBeDefined();
      expect(response.body.locationId).toBeDefined();
    });

    it('should return 400 for invalid listing ID format', async () => {
      const response = await request(testApp)
        .get('/api/listings/invalid-id')
        .expect(400);

      expect(response.body.error).toBe('Invalid listing ID format');
    });

    it('should return 404 for non-existent listing', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(testApp)
        .get(`/api/listings/${nonExistentId}`)
        .expect(404);

      expect(response.body.message).toBe('Listing not found');
    });
  });

  describe('GET /api/listings/nearby', () => {
    let nearbyListing: any;
    let farListing: any;

    beforeEach(async () => {
      // Create a location and listing nearby (within 10km)
      const nearbyLocation = await createTestLocation({
        place_id: 'nearby_place',
        name: 'Nearby Restaurant',
        address: 'Nearby Street',
        coordinates: {
          lat: 37.7849, // Close to test coordinates
          lng: -122.4094,
        },
      });

      nearbyListing = new Listing({
        userId: testUser._id,
        title: 'Nearby Listing',
        description: 'Close to you',
        category: 'dining',
        locationId: nearbyLocation._id,
        status: 'pending',
      });
      await nearbyListing.save();

      // Create a location and listing far away (more than 80km)
      const farLocation = await createTestLocation({
        place_id: 'far_place',
        name: 'Far Restaurant',
        address: 'Far Street',
        coordinates: {
          lat: 38.7749, // About 111km away
          lng: -122.4194,
        },
      });

      farListing = new Listing({
        userId: testUser._id,
        title: 'Far Listing',
        description: 'Far from you',
        category: 'dining',
        locationId: farLocation._id,
        status: 'pending',
      });
      await farListing.save();
    });

    it('should return nearby listings within default distance', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check that nearby listing is included
      const nearbyFound = response.body.some(
        (listing: any) =>
          listing._id.toString() === nearbyListing._id.toString(),
      );
      expect(nearbyFound).toBe(true);
    });

    it('should return nearby listings within custom distance', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
          distance: 10, // 10km radius
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // Should include nearby listing but not far listing
      const nearbyFound = response.body.some(
        (listing: any) =>
          listing._id.toString() === nearbyListing._id.toString(),
      );
      const farFound = response.body.some(
        (listing: any) => listing._id.toString() === farListing._id.toString(),
      );

      expect(nearbyFound).toBe(true);
      expect(farFound).toBe(false);
    });

    it('should return 400 for missing coordinates', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .expect(400);

      expect(response.body.message).toBe('Latitude and longitude are required');
    });

    it('should return 400 for missing latitude', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({ lng: -122.4194 })
        .expect(400);

      expect(response.body.message).toBe('Latitude and longitude are required');
    });

    it('should return 400 for missing longitude', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({ lat: 37.7749 })
        .expect(400);

      expect(response.body.message).toBe('Latitude and longitude are required');
    });

    it('should exclude approved/matched listings', async () => {
      // Create an approved listing
      const approvedListing = new Listing({
        userId: testUser._id,
        title: 'Approved Listing',
        description: 'This is approved',
        category: 'dining',
        locationId: testLocation._id,
        status: 'approved',
      });
      await approvedListing.save();

      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(200);

      // Approved listing should not be included
      const approvedFound = response.body.some(
        (listing: any) =>
          listing._id.toString() === (approvedListing as any)._id.toString(),
      );
      expect(approvedFound).toBe(false);
    });

    it('should sort listings by distance', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
          distance: 200, // Large radius to include multiple listings
        })
        .expect(200);

      if (response.body.length > 1) {
        // Check that distances are in ascending order
        for (let i = 1; i < response.body.length; i++) {
          expect(response.body[i].distance).toBeGreaterThanOrEqual(
            response.body[i - 1].distance,
          );
        }
      }
    });
  });

  describe('Security and Validation', () => {
    it('should not expose user passwords in populated data', async () => {
      const testListing = new Listing({
        userId: testUser._id,
        title: 'Security Test Listing',
        description: 'Testing security',
        category: 'dining',
        locationId: testLocation._id,
        status: 'pending',
      });
      await testListing.save();

      const response = await request(testApp)
        .get(`/api/listings/${testListing._id}`)
        .expect(200);

      expect(response.body.userId).toBeDefined();
      expect(response.body.userId.password).toBeUndefined();
    });

    it('should validate required fields when creating listing', async () => {
      const incompleteData = {
        userId: testUser._id.toString(),
        // Missing title, description, category
        location: {
          place_id: 'test_place',
          name: 'Test Place',
        },
      };

      const response = await request(testApp)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteData)
        .expect(500);

      expect(response.body.error).toBe('Failed to create listing');
    });

    it('should validate category enum values', async () => {
      const invalidCategoryData = {
        userId: testUser._id.toString(),
        title: 'Test Listing',
        description: 'Test description',
        category: 'invalid-category', // Invalid category
        location: {
          place_id: 'test_place',
          name: 'Test Place',
        },
      };

      const response = await request(testApp)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCategoryData)
        .expect(500);

      expect(response.body.error).toBe('Failed to create listing');
    });
  });

  describe('Edge Cases', () => {
    it('should handle listings with no location coordinates gracefully', async () => {
      // Create location without coordinates
      const locationWithoutCoords = await createTestLocation({
        place_id: 'no_coords_place',
        name: 'No Coords Restaurant',
        address: 'No Coords Street',
        // No coordinates field
      });

      const listing = new Listing({
        userId: testUser._id,
        title: 'No Coords Listing',
        description: 'No coordinates',
        category: 'dining',
        locationId: locationWithoutCoords._id,
        status: 'pending',
      });
      await listing.save();

      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(200);

      // Should not include listing without coordinates
      const noCoordFound = response.body.some(
        (item: any) => item._id.toString() === (listing as any)._id.toString(),
      );
      expect(noCoordFound).toBe(false);
    });

    it('should handle malformed coordinates in query', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({
          lat: 'invalid',
          lng: 'invalid',
        })
        .expect(200);

      // Should return empty array or handle gracefully
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle very large distance values', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
          distance: 999999, // Very large distance
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle zero distance', async () => {
      const response = await request(testApp)
        .get('/api/listings/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
          distance: 0,
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
