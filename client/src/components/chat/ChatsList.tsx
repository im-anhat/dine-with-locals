import { useState, useEffect } from 'react';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';
import { ChatItem } from './ui/ChatItem.js';
import type Chat from '../../../../shared/types/Chat.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;
interface ChatsProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
}

export function ChatsList({ onSelectChat, selectedChatId }: ChatsProps) {
  const [chats, setChats] = useState<Chat[]>([]);

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
          return (
            <ChatItem
              key={chat._id}
              chat={chat}
              onSelectChat={onSelectChat}
              selectedChatId={selectedChatId}
            />
          );
        })}
      </div>
    </div>
  );
}
