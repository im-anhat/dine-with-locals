import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateDistance,
  getListingsWithinDistanceFromAPI,
  getAllListings,
  createListing,
  getListingById,
} from './ListingService';
import { mockListing, mockCoordinates } from '../test/mocks';
import axios from 'axios';

// Mock axios with proper setup
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

const mockedAxios = axios as any;

describe('ListingService', () => {
  const mockAxiosGet = vi.fn();
  const mockAxiosPost = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup axios mocks
    mockedAxios.get = mockAxiosGet;
    mockedAxios.post = mockAxiosPost;
    mockedAxios.isAxiosError = vi.fn();

    // Ensure test environment
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_API_BASE_URL: 'http://localhost:3000/',
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates correctly', () => {
      const coord1 = { lat: 40.7128, lng: -74.006 }; // NYC
      const coord2 = { lat: 34.0522, lng: -118.2437 }; // LA

      const distance = calculateDistance(coord1, coord2);

      // Distance between NYC and LA is approximately 3935 km
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });

    it('should return 0 for same coordinates', () => {
      const coord = { lat: 40.7128, lng: -74.006 };

      const distance = calculateDistance(coord, coord);

      expect(distance).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const coord1 = { lat: -33.8688, lng: 151.2093 }; // Sydney
      const coord2 = { lat: 51.5074, lng: -0.1278 }; // London

      const distance = calculateDistance(coord1, coord2);

      expect(distance).toBeGreaterThan(16900); // approximately 17,000 km
    });

    it('should handle coordinates at poles', () => {
      const northPole = { lat: 90, lng: 0 };
      const southPole = { lat: -90, lng: 0 };

      const distance = calculateDistance(northPole, southPole);

      // Distance between poles should be approximately half Earth's circumference
      expect(distance).toBeGreaterThan(19000);
      expect(distance).toBeLessThan(21000);
    });

    it('should handle coordinates crossing 180th meridian', () => {
      const coord1 = { lat: 0, lng: 179 };
      const coord2 = { lat: 0, lng: -179 };

      const distance = calculateDistance(coord1, coord2);

      // Should be shortest distance, not wrapping around
      expect(distance).toBeLessThan(300); // approximately 222 km
    });
  });

  describe('getListingsWithinDistanceFromAPI', () => {
    it('should fetch listings within distance successfully', async () => {
      const mockListings = [mockListing];
      const mockResponse = { data: mockListings };

      mockAxiosGet.mockResolvedValueOnce(mockResponse);

      const result = await getListingsWithinDistanceFromAPI(
        mockCoordinates,
        50,
      );

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'http://localhost:3000/api/listing/nearby',
        {
          params: {
            lat: mockCoordinates.lat,
            lng: mockCoordinates.lng,
            distance: 50,
          },
        },
      );
      expect(result).toEqual(mockListings);
    });

    it('should use default distance of 80km when not specified', async () => {
      const mockListings = [mockListing];
      const mockResponse = { data: mockListings };

      mockAxiosGet.mockResolvedValueOnce(mockResponse);

      await getListingsWithinDistanceFromAPI(mockCoordinates);

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'http://localhost:3000/api/listing/nearby',
        {
          params: {
            lat: mockCoordinates.lat,
            lng: mockCoordinates.lng,
            distance: 80,
          },
        },
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockAxiosGet.mockRejectedValueOnce(error);

      await expect(
        getListingsWithinDistanceFromAPI(mockCoordinates),
      ).rejects.toThrow('Network error');
    });

    it('should handle empty results', async () => {
      const mockResponse = { data: [] };

      mockAxiosGet.mockResolvedValueOnce(mockResponse);

      const result = await getListingsWithinDistanceFromAPI(mockCoordinates);

      expect(result).toEqual([]);
    });

    it('should handle invalid coordinates', async () => {
      const invalidCoords = { lat: 999, lng: 999 };
      const error = new Error('Invalid coordinates');

      mockAxiosGet.mockRejectedValueOnce(error);

      await expect(
        getListingsWithinDistanceFromAPI(invalidCoords),
      ).rejects.toThrow('Invalid coordinates');
    });
  });

  describe('getAllListings', () => {
    it('should fetch all listings successfully', async () => {
      const mockListings = [mockListing];
      const mockResponse = { data: mockListings };

      mockAxiosGet.mockResolvedValueOnce(mockResponse);

      const result = await getAllListings();

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'http://localhost:3000/api/listing',
      );
      expect(result).toEqual(mockListings);
    });

    it('should handle empty listings response', async () => {
      const mockResponse = { data: [] };

      mockAxiosGet.mockResolvedValueOnce(mockResponse);

      const result = await getAllListings();

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const error = new Error('Server error');
      mockAxiosGet.mockRejectedValueOnce(error);

      await expect(getAllListings()).rejects.toThrow('Server error');
    });
  });

  describe('createListing', () => {
    it('should create listing successfully', async () => {
      const listingData = {
        title: 'Test Listing',
        description: 'Test Description',
        category: 'dining' as const,
      };

      const mockResponse = { data: { listing: mockListing } };
      mockAxiosPost.mockResolvedValueOnce(mockResponse);

      const result = await createListing(listingData);

      expect(mockAxiosPost).toHaveBeenCalledWith(
        'http://localhost:3000/api/listing',
        listingData,
      );
      expect(result).toEqual(mockListing);
    });

    it('should handle creation errors', async () => {
      const listingData = { title: 'Test' };
      const error = new Error('Validation error');

      mockAxiosPost.mockRejectedValueOnce(error);

      await expect(createListing(listingData)).rejects.toThrow(
        'Validation error',
      );
    });

    it('should handle missing required fields', async () => {
      const incompleteData = {};
      const error = new Error('Missing required fields');

      mockAxiosPost.mockRejectedValueOnce(error);

      await expect(createListing(incompleteData)).rejects.toThrow(
        'Missing required fields',
      );
    });
  });

  describe('getListingById', () => {
    it('should fetch listing by valid ID', async () => {
      const validId = '64a1b2c3d4e5f6789012345c';
      const mockResponse = { data: mockListing };

      mockAxiosGet.mockResolvedValueOnce(mockResponse);

      const result = await getListingById(validId);

      expect(mockAxiosGet).toHaveBeenCalledWith(
        `http://localhost:3000/api/listing/${validId}`,
      );
      expect(result).toEqual(mockListing);
    });

    it('should throw error for invalid ID format', async () => {
      const invalidId = 'invalid-id';

      await expect(getListingById(invalidId)).rejects.toThrow(
        'Invalid listing ID format: invalid-id. Expected 24 hexadecimal characters.',
      );
    });

    it('should throw error for missing ID', async () => {
      await expect(getListingById('')).rejects.toThrow(
        'Missing or invalid listing ID: ',
      );
    });

    it('should throw error for null ID', async () => {
      await expect(getListingById(null as any)).rejects.toThrow(
        'Missing or invalid listing ID: null',
      );
    });

    it('should handle API errors for valid ID', async () => {
      const validId = '64a1b2c3d4e5f6789012345c';
      const error = new Error('Not found');

      mockAxiosGet.mockRejectedValueOnce(error);

      await expect(getListingById(validId)).rejects.toThrow('Not found');
    });

    it('should handle valid but non-existent ID', async () => {
      const validNonExistentId = '64a1b2c3d4e5f6789012345f';
      const error = new Error('Listing not found');

      mockAxiosGet.mockRejectedValueOnce(error);

      await expect(getListingById(validNonExistentId)).rejects.toThrow(
        'Listing not found',
      );
    });
  });
});
