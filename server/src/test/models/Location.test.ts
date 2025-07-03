/**
 * Location Model Tests
 * Tests for the Location model validation, creation, and database operations
 */

import { Types } from 'mongoose';

// Import Location model using require to avoid ESM issues
const LocationModel = require('../../models/Location.ts').default;

describe('Location Model Tests', () => {
  const validLocationData = {
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    zipCode: '94102',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
    name: 'Downtown SF',
    place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
  };

  describe('Location Creation', () => {
    it('should create a new location with valid data', async () => {
      const location = new LocationModel(validLocationData);
      const savedLocation = await location.save();

      expect(savedLocation._id).toBeDefined();
      expect(savedLocation.address).toBe(validLocationData.address);
      expect(savedLocation.city).toBe(validLocationData.city);
      expect(savedLocation.state).toBe(validLocationData.state);
      expect(savedLocation.country).toBe(validLocationData.country);
      expect(savedLocation.coordinates.lat).toBe(
        validLocationData.coordinates.lat,
      );
      expect(savedLocation.coordinates.lng).toBe(
        validLocationData.coordinates.lng,
      );
      expect(savedLocation.createdAt).toBeDefined();
      expect(savedLocation.updatedAt).toBeDefined();
    });

    it('should create a location with minimal required data', async () => {
      const minimalData = {
        city: 'Los Angeles',
      };

      const location = new LocationModel(minimalData);
      const savedLocation = await location.save();

      expect(savedLocation.city).toBe('Los Angeles');
      expect(savedLocation.country).toBe('USA'); // Default value
      expect(savedLocation.address).toBe(''); // Default value
      expect(savedLocation.state).toBe(''); // Default value
    });

    it('should handle coordinates as optional', async () => {
      const dataWithoutCoordinates = {
        address: '456 Oak Street',
        city: 'Portland',
        state: 'OR',
      };

      const location = new LocationModel(dataWithoutCoordinates);
      const savedLocation = await location.save();

      expect(savedLocation.city).toBe('Portland');
      // Coordinates might be an empty object or undefined
      expect(savedLocation.coordinates?.lat).toBeUndefined();
      expect(savedLocation.coordinates?.lng).toBeUndefined();
    });
  });

  describe('Location Validation', () => {
    it('should require city field', async () => {
      const invalidData = {
        address: '789 Pine Street',
        state: 'WA',
        // Missing required city
      };

      const location = new LocationModel(invalidData);

      await expect(location.save()).rejects.toThrow(/required/);
    });

    it('should trim whitespace from string fields', async () => {
      const dataWithWhitespace = {
        city: '  Seattle  ',
        address: '  123 Space Street  ',
        state: '  WA  ',
        zipCode: '  98101  ',
      };

      const location = new LocationModel(dataWithWhitespace);
      const savedLocation = await location.save();

      expect(savedLocation.city).toBe('Seattle');
      expect(savedLocation.address).toBe('123 Space Street');
      expect(savedLocation.state).toBe('WA');
      expect(savedLocation.zipCode).toBe('98101');
    });

    it('should accept valid coordinate ranges', async () => {
      const validCoordinates = [
        { lat: 90, lng: 180 }, // Max values
        { lat: -90, lng: -180 }, // Min values
        { lat: 0, lng: 0 }, // Zero values
        { lat: 37.7749, lng: -122.4194 }, // Real SF coordinates
      ];

      for (const coords of validCoordinates) {
        const location = new LocationModel({
          city: 'Test City',
          coordinates: coords,
        });

        const savedLocation = await location.save();
        expect(savedLocation.coordinates.lat).toBe(coords.lat);
        expect(savedLocation.coordinates.lng).toBe(coords.lng);
      }
    });
  });

  describe('Location Queries', () => {
    beforeEach(async () => {
      // Clean up any existing test data
      await LocationModel.deleteMany({ city: /^Test/ });

      // Create test locations
      const testLocations = [
        { ...validLocationData, city: 'Test City 1', state: 'CA' },
        {
          ...validLocationData,
          city: 'Test City 2',
          state: 'NY',
          country: 'USA',
        },
        {
          ...validLocationData,
          city: 'Test City 3',
          state: 'CA',
          country: 'Canada',
        },
      ];

      await LocationModel.insertMany(testLocations);
    });

    afterEach(async () => {
      // Clean up test data
      await LocationModel.deleteMany({ city: /^Test/ });
    });

    it('should find locations by city', async () => {
      const location = await LocationModel.findOne({ city: 'Test City 1' });

      expect(location).toBeTruthy();
      expect(location.state).toBe('CA');
    });

    it('should find locations by state', async () => {
      const caLocations = await LocationModel.find({ state: 'CA' });

      expect(caLocations.length).toBeGreaterThanOrEqual(2);
      caLocations.forEach((loc) => {
        expect(loc.state).toBe('CA');
      });
    });

    it('should find locations by country', async () => {
      const usLocations = await LocationModel.find({ country: 'USA' });
      const canadaLocations = await LocationModel.find({ country: 'Canada' });

      expect(usLocations.length).toBeGreaterThanOrEqual(2);
      expect(canadaLocations.length).toBeGreaterThanOrEqual(1);
    });

    it('should count total test locations', async () => {
      const count = await LocationModel.countDocuments({ city: /^Test/ });

      expect(count).toBe(3);
    });
  });

  describe('Location Updates', () => {
    it('should update location coordinates', async () => {
      const location = new LocationModel({
        city: 'Update Test City',
        coordinates: { lat: 0, lng: 0 },
      });

      const savedLocation = await location.save();

      // Update coordinates
      savedLocation.coordinates = { lat: 40.7128, lng: -74.006 }; // NYC coordinates
      const updatedLocation = await savedLocation.save();

      expect(updatedLocation.coordinates.lat).toBe(40.7128);
      expect(updatedLocation.coordinates.lng).toBe(-74.006);
      expect(updatedLocation.updatedAt).not.toEqual(updatedLocation.createdAt);
    });

    it('should update location address information', async () => {
      const location = new LocationModel({
        city: 'Update Test',
        address: 'Old Address',
      });

      const savedLocation = await location.save();

      // Update address
      savedLocation.address = 'New Updated Address';
      savedLocation.zipCode = '12345';
      const updatedLocation = await savedLocation.save();

      expect(updatedLocation.address).toBe('New Updated Address');
      expect(updatedLocation.zipCode).toBe('12345');
    });
  });
});
