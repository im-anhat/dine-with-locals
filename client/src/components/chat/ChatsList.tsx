import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Chat {
  _id: string;
  chatName: string; // for group chats, later feature if needed
  isGroupChat: boolean;
  users: {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
    phone: string; // maybe for call feature
    avatar: string;
    role: string; // maybe to display associated listing later
  }[];
  latestMessage: {
    _id: string;
    content: string;
    senderId: {
      _id: string;
      firstName: string;
    };
    chat: string;
    readBy: string[];
    createdAt: Date;
  };
  listing?: {
    _id: string;
    title: string;
    images: string[];
    locationId: {
      _id: string;
      city: string;
      state: string;
      country: string;
    };
    time: string;
  };
  groupAdmin: string; // for group chats, later feature if needed
}

interface ChatsProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
}

export function ChatsList({ onSelectChat, selectedChatId }: ChatsProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const { currentUser } = useUser();

  // fetch existing chats when mounted
  useEffect(() => {
    const fetchChats = async () => {
      const response = await axios.get(`${API_URL}api/chat`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = response.data;
      setChats(data);
      // console.log('Fetched chats:', data.map((chat) => chat._id));
      // console.log('Fetched chats:', JSON.stringify(data, null, 2));
    };
    fetchChats();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 space-y-2 flex items-center h-[64px]">
        <h1 className="text-xl font-bold">Chats</h1>
      </div>
      <Separator orientation="horizontal" />
      <div className="p-2 space-y-2">
        {chats.map((chat) => {
          const otherParticipant = chat.users.find(
            (p) => p._id !== currentUser?._id,
          );
          return (
            <button
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              className={`w-full p-4 rounded-lg flex items-center gap-4 hover:bg-muted transition-colors ${
                selectedChatId === chat._id ? 'bg-muted' : ''
              }`}
            >
              {chat.listing ? (
                <>
                  {/* Image and Avatar Container (with listing) */}
                  <div className="relative flex-shrink-0 w-16 h-16">
                    {chat.listing.images[0] && (
                      <img
                        src={chat.listing.images[0]}
                        alt={chat.listing.title}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    )}
                    <Avatar className="absolute bottom-0 right-0 w-8 h-8 border-2 border-background">
                      <AvatarImage src={otherParticipant?.avatar} />
                      <AvatarFallback>
                        {otherParticipant?.firstName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {/* Text Content (with listing) */}
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-medium truncate">
                      {otherParticipant?.firstName} {otherParticipant?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.listing.time
                        ? format(new Date(chat.listing.time), 'MMM dd')
                        : ''}{' '}
                      -{' '}
                      {chat.listing
                        ? `${chat.listing.locationId.city}, ${chat.listing.locationId.state}`
                        : ''}
                    </p>
                    {chat.latestMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.latestMessage.senderId.firstName}:{' '}
                        {chat.latestMessage.content}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Original Layout (no listing) */}
                  <Avatar>
                    <AvatarImage src={otherParticipant?.avatar} />
                    <AvatarFallback>
                      {otherParticipant?.firstName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="justify-between items-start">
                      <p className="font-medium truncate">
                        {otherParticipant?.firstName}{' '}
                        {otherParticipant?.lastName}
                      </p>
                    </div>
                    {chat.latestMessage && (
                      <p className="text-sm text-muted-foreground truncate text-left">
                        {chat.latestMessage.senderId.firstName}:{' '}
                        {chat.latestMessage.content}
                      </p>
                    )}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
