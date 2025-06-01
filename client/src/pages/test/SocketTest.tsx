import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  from?: string;
}

export default function SocketTest() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [blogId, setBlogId] = useState('');
  const [commentText, setCommentText] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      query: { userId },
      withCredentials: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to socket server');
      toast({
        title: 'Socket Connected',
        description: `Connected as user: ${userId}`,
      });
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from socket server');
    });

    newSocket.on('connection_confirmed', (data) => {
      console.log('Connection confirmed:', data);
    });

    // Listen for notifications
    newSocket.on('new_notification', (notification) => {
      console.log('New notification received:', notification);
      const newNotification = {
        id: Date.now().toString(),
        ...notification,
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev]);

      toast({
        title: `New ${notification.type}`,
        description: notification.message,
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, toast]);

  const connectSocket = () => {
    if (!userId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a user ID',
        variant: 'destructive',
      });
      return;
    }

    // Re-initialize the socket with the new userId
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const newSocket = io(SOCKET_URL, {
      query: { userId },
      withCredentials: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const sendLikeNotification = () => {
    if (!socket || !targetUserId || !blogId) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    socket.emit('send_notification', {
      targetUserId,
      type: 'like',
      message: `User ${userId} liked your blog post`,
      blogId,
    });

    toast({
      title: 'Notification Sent',
      description: `Like notification sent to user ${targetUserId}`,
    });
  };

  const sendCommentNotification = () => {
    if (!socket || !targetUserId || !blogId || !commentText) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    socket.emit('send_notification', {
      targetUserId,
      type: 'comment',
      message: `User ${userId} commented: "${commentText}"`,
      blogId,
      commentText,
    });

    toast({
      title: 'Notification Sent',
      description: `Comment notification sent to user ${targetUserId}`,
    });
    setCommentText('');
  };

  const joinBlogRoom = () => {
    if (!socket || !blogId) {
      toast({
        title: 'Error',
        description: 'Please enter a blog ID and connect first',
        variant: 'destructive',
      });
      return;
    }

    socket.emit('join_blog', blogId);
    toast({
      title: 'Room Joined',
      description: `Joined blog room: ${blogId}`,
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Socket.io Notification Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection</CardTitle>
            <CardDescription>Set up your socket connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userId" className="text-sm font-medium">
                Your User ID
              </label>
              <div className="flex gap-2">
                <Input
                  id="userId"
                  placeholder="Enter your user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <Button onClick={connectSocket} disabled={!userId.trim()}>
                  Connect
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
              <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Notifications</CardTitle>
            <CardDescription>
              Test sending notifications to users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="targetUserId" className="text-sm font-medium">
                Target User ID
              </label>
              <Input
                id="targetUserId"
                placeholder="Enter target user ID"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="blogId" className="text-sm font-medium">
                Blog ID
              </label>
              <div className="flex gap-2">
                <Input
                  id="blogId"
                  placeholder="Enter blog ID"
                  value={blogId}
                  onChange={(e) => setBlogId(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={joinBlogRoom}
                  disabled={!connected || !blogId}
                >
                  Join Room
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Comment Text
              </label>
              <Textarea
                id="comment"
                placeholder="Type a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={sendLikeNotification}
              disabled={!connected || !targetUserId || !blogId}
            >
              Send Like
            </Button>
            <Button
              onClick={sendCommentNotification}
              disabled={!connected || !targetUserId || !blogId || !commentText}
            >
              Send Comment
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Recent received notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No notifications received yet
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {notification.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-2">{notification.message}</p>
                    {notification.from && (
                      <p className="text-xs text-gray-500 mt-1">
                        From: {notification.from}
                      </p>
                    )}
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
