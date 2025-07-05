import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notificationService } from '../../services/NotificationService';
import { mockUser } from '../mocks';

// Mock fetch for NotificationService
const mockFetch = vi.fn();

describe('NotificationService', () => {
  const testApiUrl = 'http://localhost:3001/api';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;

    // Set test environment
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

  describe('getUserNotifications', () => {
    const mockNotificationResponse = {
      notifications: [
        {
          _id: 'notification1',
          recipientId: mockUser._id,
          senderId: {
            _id: 'sender1',
            userName: 'sender',
            firstName: 'Sender',
            lastName: 'User',
            avatar: 'avatar.jpg',
          },
          type: 'like',
          message: 'liked your post',
          blogId: {
            _id: 'blog1',
            blogTitle: 'Test Blog',
          },
          isRead: false,
          createdAt: '2023-12-01T10:00:00.000Z',
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
        limit: 20,
      },
      unreadCount: 1,
    };

    it('should fetch notifications successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockNotificationResponse),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await notificationService.getUserNotifications(
        mockUser._id,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `${testApiUrl}/notifications/user/${mockUser._id}?page=1&limit=20&unreadOnly=false`,
        { credentials: 'include' },
      );
      expect(result).toEqual(mockNotificationResponse);
    });

    it('should handle custom pagination parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockNotificationResponse),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await notificationService.getUserNotifications(mockUser._id, 2, 10, true);

      expect(mockFetch).toHaveBeenCalledWith(
        `${testApiUrl}/notifications/user/${mockUser._id}?page=2&limit=10&unreadOnly=true`,
        { credentials: 'include' },
      );
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: () => Promise.resolve('Server error'),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(
        notificationService.getUserNotifications(mockUser._id),
      ).rejects.toThrow('Failed to fetch notifications: 500 - Server error');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network failed');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(
        notificationService.getUserNotifications(mockUser._id),
      ).rejects.toThrow('Network failed');
    });

    it('should handle empty notifications response', async () => {
      const emptyResponse = {
        notifications: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          limit: 20,
        },
        unreadCount: 0,
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(emptyResponse),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await notificationService.getUserNotifications(
        mockUser._id,
      );

      expect(result.notifications).toEqual([]);
      expect(result.unreadCount).toBe(0);
    });
  });

  describe('markAsRead', () => {
    const mockNotification = {
      _id: 'notification1',
      recipientId: mockUser._id,
      senderId: {
        _id: 'sender1',
        userName: 'sender',
        firstName: 'Sender',
        lastName: 'User',
        avatar: 'avatar.jpg',
      },
      type: 'like' as const,
      message: 'liked your post',
      blogId: {
        _id: 'blog1',
        blogTitle: 'Test Blog',
      },
      isRead: true, // Now marked as read
      createdAt: '2023-12-01T10:00:00.000Z',
    };

    it('should mark notification as read successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockNotification),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await notificationService.markAsRead('notification1');

      expect(mockFetch).toHaveBeenCalledWith(
        `${testApiUrl}/notifications/notification1/read`,
        {
          method: 'PATCH',
          credentials: 'include',
        },
      );
      expect(result).toEqual(mockNotification);
      expect(result.isRead).toBe(true);
    });

    it('should handle mark as read errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(
        notificationService.markAsRead('nonexistent-id'),
      ).rejects.toThrow('Failed to mark notification as read');
    });

    it('should handle network errors during mark as read', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(
        notificationService.markAsRead('notification1'),
      ).rejects.toThrow('Network error');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({ message: 'All notifications marked as read' }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await notificationService.markAllAsRead(mockUser._id);

      expect(mockFetch).toHaveBeenCalledWith(
        `${testApiUrl}/notifications/user/${mockUser._id}/read-all`,
        {
          method: 'PATCH',
          credentials: 'include',
        },
      );
      expect(result).toEqual({ message: 'All notifications marked as read' });
    });

    it('should handle mark all as read errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(
        notificationService.markAllAsRead(mockUser._id),
      ).rejects.toThrow('Failed to mark all notifications as read');
    });

    it('should handle network errors during mark all as read', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(
        notificationService.markAllAsRead(mockUser._id),
      ).rejects.toThrow('Network error');
    });

    it('should handle invalid user ID for mark all as read', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(notificationService.markAllAsRead('')).rejects.toThrow(
        'Failed to mark all notifications as read',
      );
    });
  });

  describe('API Integration', () => {
    it('should include credentials in all requests', async () => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            notifications: [],
            pagination: {},
            unreadCount: 0,
          }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await notificationService.getUserNotifications(mockUser._id);
      await notificationService.markAsRead('notification1');
      await notificationService.markAllAsRead(mockUser._id);

      // Verify all calls include credentials
      expect(mockFetch).toHaveBeenCalledTimes(3);
      mockFetch.mock.calls.forEach((call) => {
        expect(call[1]).toEqual(
          expect.objectContaining({
            credentials: 'include',
          }),
        );
      });
    });

    it('should handle malformed JSON responses', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(
        notificationService.getUserNotifications(mockUser._id),
      ).rejects.toThrow('Invalid JSON');
    });
  });
});
