/**
 * Location Controller Tests
 * Tests location functionality including CRUD operations and geolocation features
 */

import request from 'supertest';
import mongoose from 'mongoose';
import testApp from '../testApp.js';
import Location from '../../models/Location.js';
import { cleanupTestData } from '../helpers/testHelpers.js';
import axios from 'axios';

// Mock axios for external API calls
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Location Controller', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('GET /api/location - getAllLocations', () => {
    it('should return all locations', async () => {
      // Create test locations
      const location1 = await Location.create({
        address: '123 Test St',
        city: 'Test City',
        state: 'CA',
        country: 'USA',
        zipCode: '12345',
        coordinates: { lat: 37.7749, lng: -122.4194 },
        name: 'Test Location 1',
        place_id: 'test-place-1',
      });

      const location2 = await Location.create({
        address: '456 Demo Ave',
        city: 'Demo City',
        state: 'NY',
        country: 'USA',
        zipCode: '67890',
        coordinates: { lat: 40.7128, lng: -74.006 },
        name: 'Test Location 2',
        place_id: 'test-place-2',
      });

      const response = await request(testApp).get('/api/location').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].city).toBeDefined();
      expect(response.body[1].city).toBeDefined();
    });

    it('should return empty array when no locations exist', async () => {
      const response = await request(testApp).get('/api/location').expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Location, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(testApp).get('/api/location').expect(500);

      expect(response.body).toHaveProperty(
        'message',
        'Server error while fetching locations',
      );
    });
  });

  describe('POST /api/location/createLocation - createNewLocation', () => {
    beforeEach(() => {
      // Mock successful Google Maps API response
      mockedAxios.get.mockResolvedValue({
        data: {
          results: [
            {
              geometry: {
                location: {
                  lat: 37.7749,
                  lng: -122.4194,
                },
              },
            },
          ],
        },
      });
    });

    it('should create a new location with Google Maps API integration', async () => {
      const locationData = {
        address: '1600 Amphitheatre Parkway',
        city: 'Mountain View',
        state: 'CA',
        country: 'USA',
        zipCode: '94043',
      };

      const response = await request(testApp)
        .post('/api/location/createLocation')
        .send(locationData)
        .expect(200);

      expect(response.body).toHaveProperty('locationId');
      expect(response.body).toHaveProperty(
        'message',
        'Location created successfully in location collection',
      );

      // Verify location was saved to database
      const savedLocation = await Location.findById(response.body.locationId);
      expect(savedLocation).toBeTruthy();
      expect(savedLocation!.city).toBe(locationData.city);
      expect(savedLocation!.coordinates).toEqual({
        lat: 37.7749,
        lng: -122.4194,
      });

      // Verify Google Maps API was called
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(
          'https://maps.googleapis.com/maps/api/geocode/json',
        ),
      );
    });

    it('should create location with minimal required fields', async () => {
      const locationData = {
        city: 'Simple City',
        country: 'USA',
      };

      const response = await request(testApp)
        .post('/api/location/createLocation')
        .send(locationData)
        .expect(200);

      expect(response.body).toHaveProperty('locationId');

      // Verify in database
      const savedLocation = await Location.findById(response.body.locationId);
      expect(savedLocation!.city).toBe(locationData.city);
      expect(savedLocation!.country).toBe(locationData.country);
    });

    it('should handle Google Maps API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const locationData = {
        address: '123 Error St',
        city: 'Error City',
        country: 'USA',
      };

      const response = await request(testApp)
        .post('/api/location/createLocation')
        .send(locationData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle database save errors', async () => {
      jest.spyOn(Location, 'create').mockImplementationOnce(() => {
        throw new Error('Database save error');
      });

      const locationData = {
        city: 'Error City',
        country: 'USA',
      };

      const response = await request(testApp)
        .post('/api/location/createLocation')
        .send(locationData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/location/:locationId - getLocationById', () => {
    let testLocation: any;

    beforeEach(async () => {
      testLocation = await Location.create({
        address: '789 Get Test St',
        city: 'Get Test City',
        state: 'TX',
        country: 'USA',
        zipCode: '75001',
        coordinates: { lat: 32.7767, lng: -96.797 },
        name: 'Get Test Location',
        place_id: 'get-test-place',
      });
    });

    it('should return a specific location by ID', async () => {
      const response = await request(testApp)
        .get(`/api/location/${testLocation._id}`)
        .expect(200);

      expect(response.body._id).toBe(testLocation._id.toString());
      expect(response.body.city).toBe('Get Test City');
      expect(response.body.address).toBe('789 Get Test St');
      expect(response.body.coordinates).toEqual({
        lat: 32.7767,
        lng: -96.797,
      });
    });

    it('should return 400 for invalid location ID format', async () => {
      const response = await request(testApp)
        .get('/api/location/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Invalid location ID format',
      );
    });

    it('should return 404 for non-existent location', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(testApp)
        .get(`/api/location/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Location not found');
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Location, 'findById').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(testApp)
        .get(`/api/location/${testLocation._id}`)
        .expect(500);

      expect(response.body).toHaveProperty(
        'message',
        'Server error while fetching location',
      );
    });
  });

  describe('PATCH /api/location/:locationId - updateLocationCoordinates', () => {
    let testLocation: any;

    beforeEach(async () => {
      testLocation = await Location.create({
        address: '321 Update St',
        city: 'Update City',
        state: 'FL',
        country: 'USA',
        zipCode: '33101',
        coordinates: { lat: 25.7617, lng: -80.1918 },
        name: 'Update Test Location',
      });
    });

    it('should update location coordinates successfully', async () => {
      const newCoordinates = {
        coordinates: {
          lat: 26.7617,
          lng: -81.1918,
        },
      };

      const response = await request(testApp)
        .patch(`/api/location/${testLocation._id}`)
        .send(newCoordinates)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Location coordinates updated successfully',
      );
      expect(response.body.location.coordinates).toEqual(
        newCoordinates.coordinates,
      );

      // Verify in database
      const updatedLocation = await Location.findById(testLocation._id);
      expect(updatedLocation!.coordinates).toEqual(newCoordinates.coordinates);
    });

    it('should return 400 for invalid location ID format', async () => {
      const coordinates = {
        coordinates: { lat: 25.7617, lng: -80.1918 },
      };

      const response = await request(testApp)
        .patch('/api/location/invalid-id')
        .send(coordinates)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Invalid location ID format',
      );
    });

    it('should return 400 for missing coordinates', async () => {
      const response = await request(testApp)
        .patch(`/api/location/${testLocation._id}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Invalid coordinates provided',
      );
    });

    it('should return 400 for invalid coordinates format', async () => {
      const invalidCoordinates = {
        coordinates: { lat: 'invalid' },
      };

      const response = await request(testApp)
        .patch(`/api/location/${testLocation._id}`)
        .send(invalidCoordinates)
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Invalid coordinates provided',
      );
    });

    it('should return 404 for non-existent location', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const coordinates = {
        coordinates: { lat: 25.7617, lng: -80.1918 },
      };

      const response = await request(testApp)
        .patch(`/api/location/${nonExistentId}`)
        .send(coordinates)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Location not found');
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Location, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const coordinates = {
        coordinates: { lat: 25.7617, lng: -80.1918 },
      };

      const response = await request(testApp)
        .patch(`/api/location/${testLocation._id}`)
        .send(coordinates)
        .expect(500);

      expect(response.body).toHaveProperty(
        'message',
        'Server error while updating location coordinates',
      );
    });
  });

  describe('GET /api/location/nearby - getNearbyLocations', () => {
    beforeEach(async () => {
      // Create test locations at various distances
      await Location.create({
        city: 'San Francisco',
        coordinates: { lat: 37.7749, lng: -122.4194 },
      });

      await Location.create({
        city: 'Oakland',
        coordinates: { lat: 37.8044, lng: -122.2711 },
      });

      await Location.create({
        city: 'Los Angeles',
        coordinates: { lat: 34.0522, lng: -118.2437 },
      });

      await Location.create({
        city: 'New York',
        coordinates: { lat: 40.7128, lng: -74.006 },
      });
    });

    it('should return nearby locations within default distance', async () => {
      // Search near San Francisco
      const response = await request(testApp)
        .get('/api/location/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);

      // Should include San Francisco and Oakland (close), but not New York (far)
      const cities = response.body.map((loc: any) => loc.city);
      expect(cities).toContain('San Francisco');
      expect(cities).toContain('Oakland');
    });

    it('should return nearby locations within specified distance', async () => {
      // Search with smaller distance (20km)
      const response = await request(testApp)
        .get('/api/location/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
          distance: 20,
        })
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);

      // Should include San Francisco and Oakland
      const cities = response.body.map((loc: any) => loc.city);
      expect(cities).toContain('San Francisco');
      expect(cities).toContain('Oakland');
    });

    it('should return empty array when no locations are nearby', async () => {
      // Search in remote location with small distance
      const response = await request(testApp)
        .get('/api/location/nearby')
        .query({
          lat: 0,
          lng: 0,
          distance: 1,
        })
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should return 400 when latitude is missing', async () => {
      const response = await request(testApp)
        .get('/api/location/nearby')
        .query({
          lng: -122.4194,
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Latitude and longitude are required',
      );
    });

    it('should return 400 when longitude is missing', async () => {
      const response = await request(testApp)
        .get('/api/location/nearby')
        .query({
          lat: 37.7749,
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Latitude and longitude are required',
      );
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Location, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(testApp)
        .get('/api/location/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(500);

      expect(response.body).toHaveProperty(
        'message',
        'Server error while finding nearby locations',
      );
    });

    it('should handle locations without coordinates', async () => {
      // Create location without coordinates
      await Location.create({
        city: 'No Coordinates City',
        country: 'USA',
      });

      const response = await request(testApp)
        .get('/api/location/nearby')
        .query({
          lat: 37.7749,
          lng: -122.4194,
        })
        .expect(200);

      // Should still return locations with coordinates
      expect(response.body.length).toBeGreaterThan(0);

      // All returned locations should have coordinates
      response.body.forEach((location: any) => {
        expect(location.coordinates).toBeDefined();
        expect(location.coordinates.lat).toBeDefined();
        expect(location.coordinates.lng).toBeDefined();
      });
    });
  });

  // Clean up mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
    mockedAxios.get.mockClear();
  });
});
