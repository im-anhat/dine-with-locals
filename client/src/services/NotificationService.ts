import { API_BASE_URL } from '@/lib/utils';

export interface Notification {
  _id: string;
  recipientId: string;
  senderId: {
    _id: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  type: 'like' | 'comment';
  message: string;
  blogId: {
    _id: string;
    blogTitle: string;
  };
  blogTitle?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  unreadCount: number;
}

class NotificationService {
  private baseUrl = `${API_BASE_URL}/notifications`;

  async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20,
    unreadOnly = false,
  ): Promise<NotificationResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString(),
    });

    console.log(
      'Making request to:',
      `${this.baseUrl}/user/${userId}?${params}`,
    );

    const response = await fetch(`${this.baseUrl}/user/${userId}?${params}`, {
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(
        `Failed to fetch notifications: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  }

  async markAllAsRead(userId: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/user/${userId}/read-all`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  }

  async getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
    const response = await fetch(
      `${this.baseUrl}/user/${userId}/unread-count`,
      {
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    return response.json();
  }

  async clearAllReadNotifications(
    userId: string,
  ): Promise<{ message: string; deletedCount: number }> {
    const response = await fetch(`${this.baseUrl}/user/${userId}/read`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to clear read notifications');
    }

    return response.json();
  }
}

export const notificationService = new NotificationService();
