import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSocket } from '@/contexts/SocketContext';
import { useUser } from '@/contexts/UserContext';

const NotificationTest: React.FC = () => {
  const [targetUserId, setTargetUserId] = useState('');
  const [message, setMessage] = useState('');
  const [testBlogId, setTestBlogId] = useState('');
  const [apiTestResult, setApiTestResult] = useState<string>('');
  const { socket, isConnected } = useSocket();
  const { currentUser } = useUser();

  // Test API connection
  const testApiConnection = async () => {
    if (!currentUser?._id) {
      setApiTestResult('No user logged in');
      return;
    }

    try {
      setApiTestResult('Testing...');
      const response = await fetch(`http://localhost:3000/api/notifications/user/${currentUser._id}`, {
        credentials: 'include',
      });
      
      const text = await response.text();
      setApiTestResult(`Status: ${response.status}, Response: ${text}`);
    } catch (error) {
      setApiTestResult(`Error: ${error}`);
    }
  };

  const sendTestNotification = () => {
    if (!socket || !targetUserId || !message) return;

    socket.emit('send_notification', {
      targetUserId,
      message,
      type: 'test',
    });

    console.log('Test notification sent to:', targetUserId);
  };

  const simulateLike = async () => {
    if (!testBlogId || !currentUser?._id) return;

    try {
      const response = await fetch('http://localhost:3000/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: currentUser._id,
          blogId: testBlogId,
        }),
      });

      if (response.ok) {
        console.log('Like created successfully');
      } else {
        const errorData = await response.text();
        console.error('Failed to create like:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error creating like:', error);
    }
  };

  const simulateComment = async () => {
    if (!testBlogId || !currentUser?._id) return;

    try {
      const response = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: currentUser._id,
          blogId: testBlogId,
          content: 'This is a test comment for notification testing!',
        }),
      });

      if (response.ok) {
        console.log('Comment created successfully');
      } else {
        const errorData = await response.text();
        console.error('Failed to create comment:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Notification System Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Socket Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`p-2 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Status: {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <div className="text-sm text-gray-600">
                User ID: {currentUser?._id || 'Not logged in'}
              </div>
              <div className="text-sm text-gray-600">
                Socket ID: {socket?.id || 'No socket'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testApiConnection}
              disabled={!currentUser?._id}
              className="w-full"
            >
              Test API Connection
            </Button>
            {apiTestResult && (
              <div className="p-2 bg-gray-100 rounded text-sm font-mono whitespace-pre-wrap">
                {apiTestResult}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Test Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Target User ID"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
            />
            <Input
              placeholder="Test message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button 
              onClick={sendTestNotification}
              disabled={!isConnected || !targetUserId || !message}
              className="w-full"
            >
              Send Test Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulate Blog Interactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Blog ID for testing"
              value={testBlogId}
              onChange={(e) => setTestBlogId(e.target.value)}
            />
            <div className="space-y-2">
              <Button 
                onClick={simulateLike}
                disabled={!testBlogId}
                className="w-full"
              >
                Simulate Like (Creates Real Notification)
              </Button>
              <Button 
                onClick={simulateComment}
                disabled={!testBlogId}
                className="w-full"
              >
                Simulate Comment (Creates Real Notification)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1.</strong> Make sure you're logged in and socket is connected</p>
              <p><strong>2.</strong> To test notifications between users, open two browser tabs with different users</p>
              <p><strong>3.</strong> Use the "Send Test Notification" to send custom notifications</p>
              <p><strong>4.</strong> Use "Simulate Like/Comment" with a real blog ID to test real notifications</p>
              <p><strong>5.</strong> Check the notification center in the sidebar to see received notifications</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationTest;
