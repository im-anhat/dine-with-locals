import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getUserById, updateUserProfile } from '../../services/UserService';
import { mockUser } from '../mocks';

// Mock fetch globally
const mockFetch = vi.fn();

describe('UserService', () => {
  const testApiUrl = 'http://localhost:3001/api';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;

    // Reset environment to test values
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_API_BASE_URL: 'http://localhost:3001/',
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getUserById', () => {
    it('should fetch user successfully', async () => {
      const userId = 'test-user-id';
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockUser),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await getUserById(userId);

      expect(mockFetch).toHaveBeenCalledWith(`${testApiUrl}/users/${userId}`);
      expect(result).toEqual(mockUser);
    });

    it('should throw error when API response is not ok', async () => {
      const userId = 'test-user-id';
      const mockResponse = {
        ok: false,
        status: 404,
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(getUserById(userId)).rejects.toThrow(
        'Failed to fetch user data: 404',
      );
    });

    it('should handle network errors', async () => {
      const userId = 'test-user-id';
      const networkError = new Error('Network error');

      mockFetch.mockRejectedValueOnce(networkError);

      await expect(getUserById(userId)).rejects.toThrow('Network error');
    });

    it('should handle invalid user ID format', async () => {
      const invalidUserId = '';

      // Even though the service doesn't validate ID format, it should still make the request
      const mockResponse = {
        ok: false,
        status: 400,
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(getUserById(invalidUserId)).rejects.toThrow(
        'Failed to fetch user data: 400',
      );
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = 'test-user-id';
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        bio: 'Updated bio',
      };

      const updatedUser = { ...mockUser, ...updateData };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(updatedUser),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await updateUserProfile(userId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(`${testApiUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when update fails', async () => {
      const userId = 'test-user-id';
      const updateData = { firstName: 'Updated' };
      const mockResponse = {
        ok: false,
        status: 400,
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(updateUserProfile(userId, updateData)).rejects.toThrow(
        'Failed to update user profile: 400',
      );
    });

    it('should handle empty update data', async () => {
      const userId = 'test-user-id';
      const updateData = {};

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockUser),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await updateUserProfile(userId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(`${testApiUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle network errors during update', async () => {
      const userId = 'test-user-id';
      const updateData = { firstName: 'Updated' };
      const networkError = new Error('Network error');

      mockFetch.mockRejectedValueOnce(networkError);

      await expect(updateUserProfile(userId, updateData)).rejects.toThrow(
        'Network error',
      );
    });

    it('should handle all supported update fields', async () => {
      const userId = 'test-user-id';
      const updateData = {
        firstName: 'New First',
        lastName: 'New Last',
        phone: '+1987654321',
        avatar: 'https://example.com/new-avatar.jpg',
        socialLink: 'https://social.com/newlink',
        hobbies: ['reading', 'hiking'],
        cuisines: ['Mexican', 'Thai'],
        ethnicity: 'Hispanic' as const,
        bio: 'New bio text',
        cover: 'https://example.com/new-cover.jpg',
      };

      const updatedUser = { ...mockUser, ...updateData };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(updatedUser),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await updateUserProfile(userId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(`${testApiUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(updatedUser);
    });
  });
});
