import { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
import { Drawer } from '@/components/ui/drawer';
import { Dialog } from '@/components/ui/dialog';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [listing, setListing] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  const oldScrollHeightRef = useRef(0);

  const { currentUser } = useUser();
  const { socket } = useSocket();

  // Scroll to bottom of messages
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // When chatId changes, reset state
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
  }, [chatId]);

  // Fetch messages from database when a chat is selected
  useEffect(() => {
    const getAllMessages = async () => {
      if (!chatId) return;
      try {
        setLoading(true);
        if (scrollContainerRef.current) {
          oldScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
        }

        const response = await axios.get(
          `${API_URL}api/message/${chatId}?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        const data = response.data;
        if (data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        console.log('Fetched messages:', data.reverse());
        setMessages((prev) =>
          page === 1 ? data.reverse() : [...data.reverse(), ...prev],
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      getAllMessages();
    } else {
      setMessages([]);
      setPage(1);
      setHasMore(false);
    }
  }, [chatId, page]);

  // Effect for managing scroll position
  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    if (page === 1) {
      // After initial message load, scroll to bottom
      scrollToBottom('auto');
    } else if (scrollContainer) {
      // After loading more older messages, restore scroll position
      const newScrollHeight = scrollContainer.scrollHeight;
      scrollContainer.scrollTop = newScrollHeight - oldScrollHeightRef.current;
    }
  }, [messages, page]);

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
        scrollToBottom('smooth');
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

    // The message will be added via the socket 'message_created' event
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
  }, [chatInfo, setListing]);

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

  const handleScroll = () => {
    const scrollTop = scrollContainerRef.current?.scrollTop;
    if (scrollTop === 0 && hasMore && !loading) {
      // Load more messages when scrolled to the top
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Drawer>
      <Dialog>
        <div className="w-full flex flex-row h-full">
          <div className="flex-1 flex flex-col h-full">
            {/* Chat Header */}
            <ChatHeader
              isGroupChat={chatInfo?.isGroupChat}
              chatInfo={chatInfo || undefined}
              onBack={onBack}
              showDetails={showDetails}
              onToggleDetails={handleToggleDetails}
              hasListing={!!listing}
            />

            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0 p-4"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
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
            {(chatInfo?.isGroupChat &&
              chatInfo?.groupAdmin === currentUser?._id) ||
            !chatInfo?.isGroupChat ? (
              <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </form>
            ) : (
              <div className="p-4 text-muted-foreground">
                You cannot send messages in this group chat.
              </div>
            )}
          </div>

          {/* Listing Details (if available and showDetails is true) */}
          {listing && chatInfo?.listing && showDetails && (
            <ListingDetails
              listing={
                chatInfo.listing as unknown as import('../../../../shared/types/ListingDetails').ListingDetails
              }
              onClose={handleToggleDetails}
            />
          )}
        </div>
      </Dialog>
    </Drawer>
  );
}
