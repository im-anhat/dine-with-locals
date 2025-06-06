import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSocket } from '@/contexts/SocketContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import {
  notificationService,
  type Notification,
} from '@/services/NotificationService';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { socket } = useSocket();
  const { currentUser } = useUser();
  const { toast } = useToast();

  // Fetch initial unread count when component mounts and refresh periodically
  useEffect(() => {
    const fetchInitialUnreadCount = async () => {
      if (!currentUser?._id) return;

      try {
        console.log('Fetching initial unread count for user:', currentUser._id);
        const data = await notificationService.getUnreadCount(currentUser._id);
        console.log('Initial unread count fetched:', data.unreadCount);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error('Error fetching initial unread count:', error);
      }
    };

    fetchInitialUnreadCount();

    // Refresh unread count every 30 seconds to ensure accuracy
    const interval = setInterval(fetchInitialUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [currentUser?._id]);

  // Fetch notifications when component mounts or drawer opens
  const fetchNotifications = async () => {
    if (!currentUser?._id) return;

    setLoading(true);
    try {
      console.log('Fetching notifications for user:', currentUser._id);
      const data = await notificationService.getUserNotifications(
        currentUser._id,
      );
      console.log('Notifications fetched successfully:', data);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      toast({
        title: 'Error',
        description:
          'Failed to fetch notifications. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      console.log('Marking notification as read:', notificationId);
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif,
        ),
      );
      setUnreadCount((prev) => {
        const newCount = Math.max(0, prev - 1);
        console.log('Marking as read: unread count from', prev, 'to', newCount);
        return newCount;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!currentUser?._id) return;

    try {
      console.log('Marking all notifications as read');
      await notificationService.markAllAsRead(currentUser._id);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      console.log('Setting unread count to 0');
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Clear all read notifications
  const clearAllReadNotifications = async () => {
    if (!currentUser?._id) return;

    try {
      console.log('Clearing all read notifications');
      const result = await notificationService.clearAllReadNotifications(
        currentUser._id,
      );
      console.log(`Cleared ${result.deletedCount} read notifications`);

      // Remove read notifications from the local state
      setNotifications((prev) => prev.filter((notif) => !notif.isRead));

      toast({
        title: 'Success',
        description: `Cleared ${result.deletedCount} read notifications`,
      });
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear read notifications',
        variant: 'destructive',
      });
    }
  };

  // Socket event listeners - Listen for real-time notifications
  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    const handleNewNotification = (notification: any) => {
      console.log(
        'New notification received in NotificationCenter:',
        notification,
      );

      // Add new notification to the top of the list
      setNotifications((prev) => [notification, ...prev]);

      // Update unread count immediately
      setUnreadCount((prev) => {
        const newCount = prev + 1;
        console.log('Updating unread count from', prev, 'to', newCount);
        return newCount;
      });

      // Show toast notification
      toast({
        title: 'New Notification',
        description: notification.message,
        duration: 5000,
      });
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, currentUser, toast]);

  // Fetch notifications when drawer opens and refresh unread count
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      // Also refresh the unread count when drawer opens to ensure sync
      const refreshUnreadCount = async () => {
        if (!currentUser?._id) return;
        try {
          const data = await notificationService.getUnreadCount(
            currentUser._id,
          );
          console.log(
            'Refreshed unread count on drawer open:',
            data.unreadCount,
          );
          setUnreadCount(data.unreadCount);
        } catch (error) {
          console.error('Error refreshing unread count:', error);
        }
      };
      refreshUnreadCount();
    }
  }, [isOpen]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    // For timestamps that are very recent (less than a minute ago)
    if (new Date().getTime() - date.getTime() < 60000) {
      return 'Just now';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      default:
        return '🔔';
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className="relative w-full flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Notification Center</span>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </div>
      </DrawerTrigger>

      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="flex flex-row items-center justify-between">
          <div>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notifications`
                : 'All caught up!'}
            </DrawerDescription>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="flex items-center gap-1"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
            )}
            {notifications.some((n) => n.isRead) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllReadNotifications}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Clear read
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <div key={notification._id}>
                  <div
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      !notification.isRead
                        ? 'bg-primary/5 border-l-4 border-l-primary'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                    onClick={() =>
                      !notification.isRead && markAsRead(notification._id)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.senderId.avatar}
                          alt={
                            notification.senderId.userName ||
                            notification.senderId.firstName
                          }
                        />
                        <AvatarFallback>
                          {(
                            notification.senderId.userName ||
                            notification.senderId.firstName
                          )
                            ?.charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                          )}
                        </div>

                        <p className="text-sm leading-relaxed">
                          {notification.message}
                        </p>

                        {notification.blogTitle && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            Blog: {notification.blogTitle}
                          </p>
                        )}
                      </div>

                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          className="flex-shrink-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
