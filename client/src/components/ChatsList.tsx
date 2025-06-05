import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';

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
      console.log('Fetched chats:', data);
    };
    fetchChats();
  }, []);

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-2">
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
                <div className="flex justify-between items-start">
                  <p className="font-medium truncate">
                    {otherParticipant?.firstName} {otherParticipant?.lastName}
                  </p>
                  {chat.latestMessage && (
                    <span className="text-xs text-muted-foreground">
                      {/* {chat.latestMessage.createdAt.toLocaleString()} */}
                    </span>
                  )}
                </div>
                {chat.latestMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.latestMessage.content}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
