import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import axios from 'axios';
import { useSocket } from '../../contexts/SocketContext.js';
import ChatMessage from './ui/ChatMessage';
import ChatHeader from './ui/ChatHeader';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import type Chat from '../../../../shared/types/Chat.js';
import ListingDetails from './ListingDetails.js';

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

interface ChatWindowProps {
  chatId?: string;
  onBack?: () => void;
}

export function ChatWindow({ chatId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [listing, setListing] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);

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

  // get additional info to display in chat header
  useEffect(() => {
    const getChatInfo = async () => {
      const response = await axios.get(`${API_URL}api/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = response.data;
      setChatInfo(data);
      console.log('Fetched chat info:', data);
    };

    if (chatId) {
      getChatInfo();
    } else {
      setChatInfo(null);
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

  // Set the listing details from chatInfo if available
  useEffect(() => {
    if (chatInfo?.listing) {
      setListing(chatInfo.listing._id);
    } else {
      setListing(null);
    }
  }, [chatInfo]);

  // Toggle details panel visibility
  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
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

  const otherUser = chatInfo?.users.find(
    (user) => user._id !== currentUser?._id,
  );

  return (
    <div className="w-full flex flex-row h-full">

      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <ChatHeader 
          otherUser={otherUser} 
          onBack={onBack}
          showDetails={showDetails}
          onToggleDetails={handleToggleDetails}
          hasListing={!!listing}
        />
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0 p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={message}
              isCurrentUser={message.senderId._id === currentUser?._id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>

      {/* Listing Details (if available and showDetails is true) */}
      {listing && chatInfo?.listing && showDetails && (
        <ListingDetails 
          listing={chatInfo.listing as unknown as import('../../../../shared/types/ListingDetails').ListingDetails} 
          onClose={handleToggleDetails}
        />
      )}
    </div>
  );
}
