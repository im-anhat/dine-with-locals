import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
const API_URL = import.meta.env.VITE_API_BASE_URL;

// interface of message that's returned from backend
interface Message {
  _id: string;
  senderId: {
    _id: string;
    firstName: string;
  };
  content: string;
  chat: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatProps {
  chatId?: string;
  onBack?: () => void;
}

export function Chat({ chatId, onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { currentUser } = useUser();
  const { socket } = useSocket();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages from database when a chat is selected
  useEffect(() => {
    const getAllMessages = async () => {
      const response = await axios.get(`${API_URL}api/message/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = response.data;
      setMessages(data);
      console.log('Fetched messages:', data);
    };
    if (chatId) {
      getAllMessages();
    } else {
      setMessages([]);
    }
  }, [chatId]);

  // Listen for new messages from socket.io
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message: Message) => {
        console.log('Message received:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.on('message_created', handleNewMessage);

      // Cleanup socket listeners
      return () => {
        socket.off('message_created', handleNewMessage);
      };
    }
  }, [socket]);

  // Send message + emit to Socket.io
  const handleSendMessage = async (e: React.FormEvent) => {
    if (!socket || !chatId || !newMessage.trim()) return;

    e.preventDefault();

    // Send message to server through socket.io
    socket.emit('message_send', { chatId, content: newMessage });
    setNewMessage('');
  };

  // If no chat is selected, show a message
  if (!chatId) {
    return (
      <div className="w-full h-full p-4 flex flex-col">
        <p className="text-muted-foreground">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 flex flex-col h-full">
      {/* Back button for mobile */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="md:hidden mb-4 text-sm flex items-center gap-4 hover:bg-muted p-2 rounded-lg"
        >
          <ChevronLeft className="w-6 h-6" /> Back
        </button>
      )}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.senderId._id === currentUser?._id
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId._id === currentUser?._id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.createdAt).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
