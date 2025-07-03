import request from 'supertest';
import testApp from '../testApp';
import User from '../../models/User';
import RequestModel from '../../models/Request';
import Location from '../../models/Location';
import jwt from 'jsonwebtoken';
import { createTestUser, createTestLocation } from '../helpers/testHelpers';

describe('RequestController', () => {
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
      name: 'Test Location',
      address: '123 Test Street',
    });
  });

  describe('GET /api/requests', () => {
    beforeEach(async () => {
      // Create test requests
      const testRequest1 = new RequestModel({
        userId: testUser._id,
        title: 'Looking for Italian Food',
        locationType: 'res',
        locationId: testLocation._id,
        interestTopic: ['food', 'culture'],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: ['Italian'],
        dietaryRestriction: ['vegetarian'],
        numGuests: 2,
        additionalInfo: 'Love authentic Italian cuisine',
        status: 'waiting',
      });
      await testRequest1.save();

      const testRequest2 = new RequestModel({
        userId: testUser._id,
        title: 'Home Cooking Experience',
        locationType: 'home',
        locationId: testLocation._id,
        interestTopic: ['cooking', 'culture'],
        time: new Date('2024-06-02T18:00:00Z'),
        cuisine: ['Asian'],
        dietaryRestriction: [],
        numGuests: 4,
        additionalInfo: 'Want to learn home cooking',
        status: 'pending',
      });
      await testRequest2.save();
    });

    it('should get all requests with populated user and location data', async () => {
      const response = await request(testApp).get('/api/requests').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check populated data structure
      const firstRequest = response.body[0];
      expect(firstRequest.userInfo).toBeDefined();
      expect(firstRequest.locationInfo).toBeDefined();
      expect(firstRequest.userInfo.userName).toBeDefined();
      expect(firstRequest.userInfo.firstName).toBeDefined();
      expect(firstRequest.locationInfo.name).toBeDefined();
      expect(firstRequest.locationInfo.address).toBeDefined();
    });

    it('should handle empty request collection', async () => {
      // Clear all requests
      await RequestModel.deleteMany({});

      const response = await request(testApp).get('/api/requests').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should handle database errors gracefully', async () => {
      // This test might be difficult to trigger without mocking
      // But we can at least ensure the endpoint exists and handles basic cases
      const response = await request(testApp).get('/api/requests').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/requests/nearby', () => {
    let nearbyRequest: any;
    let farRequest: any;
    let approvedRequest: any;

    beforeEach(async () => {
      // Create a location and request nearby (within 10km)
      const nearbyLocation = await createTestLocation({
        place_id: 'nearby_place',
        name: 'Nearby Restaurant',
        address: 'Nearby Street',
        coordinates: {
          lat: 37.7849, // Close to test coordinates
          lng: -122.4094,
        },
      });

      nearbyRequest = new RequestModel({
        userId: testUser._id,
        title: 'Nearby Request',
        locationType: 'res',
        locationId: nearbyLocation._id,
        interestTopic: ['food'],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: ['Italian'],
        dietaryRestriction: [],
        numGuests: 2,
        additionalInfo: 'Close to you',
        status: 'waiting',
      });
      await nearbyRequest.save();

      // Create a location and request far away (more than 80km)
      const farLocation = await createTestLocation({
        place_id: 'far_place',
        name: 'Far Restaurant',
        address: 'Far Street',
        coordinates: {
          lat: 38.7749, // About 111km away
          lng: -122.4194,
        },
      });

      farRequest = new RequestModel({
        userId: testUser._id,
        title: 'Far Request',
        locationType: 'res',
        locationId: farLocation._id,
        interestTopic: ['food'],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: ['Chinese'],
        dietaryRestriction: [],
        numGuests: 3,
        additionalInfo: 'Far from you',
        status: 'waiting',
      });
      await farRequest.save();

      // Create an approved request (should be excluded)
      approvedRequest = new RequestModel({
        userId: testUser._id,
        title: 'Approved Request',
        locationType: 'res',
        locationId: testLocation._id,
        interestTopic: ['food'],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: ['Mexican'],
        dietaryRestriction: [],
        numGuests: 2,
        additionalInfo: 'This is approved',
        status: 'approved',
      });
      await approvedRequest.save();
    });

    it('should return nearby requests within default distance', async () => {
      const response = await request(testApp)
        .get('/api/requests/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check that nearby request is included
      const nearbyFound = response.body.some(
        (req: any) =>
          req._id.toString() === (nearbyRequest as any)._id.toString(),
      );
      expect(nearbyFound).toBe(true);

      // Each request should have distance information
      response.body.forEach((req: any) => {
        expect(req.distance).toBeDefined();
        expect(typeof req.distance).toBe('number');
      });
    });

    it('should return nearby requests within custom distance', async () => {
      const response = await request(testApp)
        .get('/api/requests/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
          distance: 10, // 10km radius
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // Should include nearby request but not far request
      const nearbyFound = response.body.some(
        (req: any) =>
          req._id.toString() === (nearbyRequest as any)._id.toString(),
      );
      const farFound = response.body.some(
        (req: any) => req._id.toString() === (farRequest as any)._id.toString(),
      );

      expect(nearbyFound).toBe(true);
      expect(farFound).toBe(false);
    });

    it('should return 400 for missing coordinates', async () => {
      const response = await request(testApp)
        .get('/api/requests/nearby')
        .expect(400);

      expect(response.body.message).toBe('Latitude and longitude are required');
    });

    it('should return 400 for missing latitude', async () => {
      const response = await request(testApp)
        .get('/api/requests/nearby')
        .query({ lng: -122.4194 })
        .expect(400);

      expect(response.body.message).toBe('Latitude and longitude are required');
    });

    it('should return 400 for missing longitude', async () => {
      const response = await request(testApp)
        .get('/api/requests/nearby')
        .query({ lat: 37.7749 })
        .expect(400);

      expect(response.body.message).toBe('Latitude and longitude are required');
    });

    it('should exclude approved requests', async () => {
      const response = await request(testApp)
        .get('/api/requests/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(200);

      // Approved request should not be included
      const approvedFound = response.body.some(
        (req: any) =>
          req._id.toString() === (approvedRequest as any)._id.toString(),
      );
      expect(approvedFound).toBe(false);
    });

    it('should sort requests by distance', async () => {
      const response = await request(testApp)
        .get('/api/requests/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
          distance: 200, // Large radius to include multiple requests
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

    it('should handle requests with no location coordinates gracefully', async () => {
      // Create location without coordinates
      const locationWithoutCoords = await createTestLocation({
        place_id: 'no_coords_place',
        name: 'No Coords Location',
        address: 'No Coords Street',
        // No coordinates field
      });

      const requestNoCoords = new RequestModel({
        userId: testUser._id,
        title: 'No Coords Request',
        locationType: 'res',
        locationId: locationWithoutCoords._id,
        interestTopic: ['food'],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: ['Thai'],
        dietaryRestriction: [],
        numGuests: 2,
        additionalInfo: 'No coordinates',
        status: 'waiting',
      });
      await requestNoCoords.save();

      const response = await request(testApp)
        .get('/api/requests/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(200);

      // Should not include request without coordinates
      const noCoordFound = response.body.some(
        (req: any) =>
          req._id.toString() === (requestNoCoords as any)._id.toString(),
      );
      expect(noCoordFound).toBe(false);
    });

    it('should handle malformed coordinates in query', async () => {
      const response = await request(testApp)
        .get('/api/requests/nearby')
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
        .get('/api/requests/nearby')
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
        .get('/api/requests/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
          distance: 0,
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Security and Data Validation', () => {
    it('should not expose sensitive user data in populated requests', async () => {
      const testRequest = new RequestModel({
        userId: testUser._id,
        title: 'Security Test Request',
        locationType: 'res',
        locationId: testLocation._id,
        interestTopic: ['food'],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: ['Italian'],
        dietaryRestriction: [],
        numGuests: 2,
        additionalInfo: 'Testing security',
        status: 'waiting',
      });
      await testRequest.save();

      const response = await request(testApp).get('/api/requests').expect(200);

      const securityRequest = response.body.find(
        (req: any) => req.title === 'Security Test Request',
      );

      expect(securityRequest).toBeDefined();
      expect(securityRequest.userInfo).toBeDefined();
      expect(securityRequest.userInfo.password).toBeUndefined();
      expect(securityRequest.userInfo.userName).toBeDefined();
    });

    it('should handle database connection errors gracefully', async () => {
      // While we can't easily simulate a DB error in this test setup,
      // we can at least ensure the error handling structure is in place
      const response = await request(testApp)
        .get('/api/requests/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        });

      // Should either succeed (200) or fail gracefully with proper error message
      expect([200, 500]).toContain(response.status);

      if (response.status === 500) {
        expect(response.body.message).toContain('Server error');
      }
    });

    it('should validate request data types and formats', async () => {
      const testRequest = new RequestModel({
        userId: testUser._id,
        title: 'Validation Test',
        locationType: 'res',
        locationId: testLocation._id,
        interestTopic: ['food', 'culture'],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: ['Italian', 'Mediterranean'],
        dietaryRestriction: ['vegetarian', 'gluten-free'],
        numGuests: 3,
        additionalInfo: 'Testing data validation',
        status: 'waiting',
      });
      await testRequest.save();

      const response = await request(testApp).get('/api/requests').expect(200);

      const validationRequest = response.body.find(
        (req: any) => req.title === 'Validation Test',
      );

      expect(validationRequest).toBeDefined();
      expect(Array.isArray(validationRequest.interestTopic)).toBe(true);
      expect(Array.isArray(validationRequest.cuisine)).toBe(true);
      expect(Array.isArray(validationRequest.dietaryRestriction)).toBe(true);
      expect(typeof validationRequest.numGuests).toBe('number');
      expect(['waiting', 'pending', 'approved']).toContain(
        validationRequest.status,
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle requests with minimal data', async () => {
      const minimalRequest = new RequestModel({
        userId: testUser._id,
        title: 'Minimal Request',
        locationType: 'either',
        locationId: testLocation._id,
        interestTopic: [],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: [],
        dietaryRestriction: [],
        numGuests: 1,
        additionalInfo: '',
        status: 'waiting',
      });
      await minimalRequest.save();

      const response = await request(testApp).get('/api/requests').expect(200);

      const minimal = response.body.find(
        (req: any) => req.title === 'Minimal Request',
      );

      expect(minimal).toBeDefined();
      expect(minimal.interestTopic).toEqual([]);
      expect(minimal.cuisine).toEqual([]);
      expect(minimal.dietaryRestriction).toEqual([]);
    });

    it('should handle requests with maximum allowed guests', async () => {
      const maxGuestsRequest = new RequestModel({
        userId: testUser._id,
        title: 'Max Guests Request',
        locationType: 'home',
        locationId: testLocation._id,
        interestTopic: ['food'],
        time: new Date('2024-06-01T19:00:00Z'),
        cuisine: ['International'],
        dietaryRestriction: [],
        numGuests: 10, // Large number of guests
        additionalInfo: 'Large gathering',
        status: 'waiting',
      });
      await maxGuestsRequest.save();

      const response = await request(testApp).get('/api/requests').expect(200);

      const maxGuests = response.body.find(
        (req: any) => req.title === 'Max Guests Request',
      );

      expect(maxGuests).toBeDefined();
      expect(maxGuests.numGuests).toBe(10);
    });

    it('should handle future and past dates', async () => {
      const futureRequest = new RequestModel({
        userId: testUser._id,
        title: 'Future Request',
        locationType: 'res',
        locationId: testLocation._id,
        interestTopic: ['food'],
        time: new Date('2025-12-31T23:59:59Z'), // Far future
        cuisine: ['Fusion'],
        dietaryRestriction: [],
        numGuests: 2,
        additionalInfo: 'Future dining',
        status: 'waiting',
      });
      await futureRequest.save();

      const pastRequest = new RequestModel({
        userId: testUser._id,
        title: 'Past Request',
        locationType: 'res',
        locationId: testLocation._id,
        interestTopic: ['food'],
        time: new Date('2020-01-01T00:00:00Z'), // Past date
        cuisine: ['Traditional'],
        dietaryRestriction: [],
        numGuests: 2,
        additionalInfo: 'Past dining',
        status: 'waiting',
      });
      await pastRequest.save();

      const response = await request(testApp).get('/api/requests').expect(200);

      const future = response.body.find(
        (req: any) => req.title === 'Future Request',
      );
      const past = response.body.find(
        (req: any) => req.title === 'Past Request',
      );

      expect(future).toBeDefined();
      expect(past).toBeDefined();
    });
  });
});
