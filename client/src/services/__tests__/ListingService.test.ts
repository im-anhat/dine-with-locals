import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateDistance,
  getListingsWithinDistanceFromAPI,
  getAllListings,
  createListing,
  getListingById,
} from '../ListingService';
import { mockListing, mockCoordinates } from '../../test/mocks';
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
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup axios mocks
    mockedAxios.get = vi.fn();
    mockedAxios.post = vi.fn();
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
  });

  describe('getListingsWithinDistanceFromAPI', () => {
    it('should fetch listings within distance successfully', async () => {
      const mockListings = [mockListing];
      const mockResponse = { data: mockListings };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getListingsWithinDistanceFromAPI(
        mockCoordinates,
        50,
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
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

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await getListingsWithinDistanceFromAPI(mockCoordinates);

      expect(mockedAxios.get).toHaveBeenCalledWith(
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
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(
        getListingsWithinDistanceFromAPI(mockCoordinates),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getAllListings', () => {
    it('should fetch all listings successfully', async () => {
      const mockListings = [mockListing];
      const mockResponse = { data: mockListings };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getAllListings();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/listings',
      );
      expect(result).toEqual(mockListings);
    });

    it('should handle empty listings response', async () => {
      const mockResponse = { data: [] };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getAllListings();

      expect(result).toEqual([]);
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
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await createListing(listingData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/listings',
        listingData,
      );
      expect(result).toEqual(mockListing);
    });

    it('should handle creation errors', async () => {
      const listingData = { title: 'Test' };
      const error = new Error('Validation error');

      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(createListing(listingData)).rejects.toThrow(
        'Validation error',
      );
    });
  });

  describe('getListingById', () => {
    it('should fetch listing by valid ID', async () => {
      const validId = '64a1b2c3d4e5f6789012345c';
      const mockResponse = { data: mockListing };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getListingById(validId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://localhost:3001/api/listing/${validId}`,
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

    it('should handle API errors for valid ID', async () => {
      const validId = '64a1b2c3d4e5f6789012345c';
      const error = new Error('Not found');

      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(getListingById(validId)).rejects.toThrow('Not found');
    });
  });
});
