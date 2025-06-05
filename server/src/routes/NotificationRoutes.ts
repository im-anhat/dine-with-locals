import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  clearAllReadNotifications,
} from '../controllers/NotificationController.js';

const router = express.Router();

// Get notifications for a user
router.get('/user/:userId', getUserNotifications);

// Get unread notification count
router.get('/user/:userId/unread-count', getUnreadNotificationCount);

// Mark notification as read
router.patch('/:notificationId/read', markNotificationAsRead);

// Mark all notifications as read for a user
router.patch('/user/:userId/read-all', markAllNotificationsAsRead);

// Clear all read notifications for a user
router.delete('/user/:userId/read', clearAllReadNotifications);

export default router;
