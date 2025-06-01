import { useState } from 'react';
import { Chat } from '../components/Chat';
import { ChatsList } from '../components/ChatsList';
import { Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../../../shared/types/typings';

interface ChatPageProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export function ChatPage({ socket }: ChatPageProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  // Handler for selecting a chat
  const handleSelectChat = (chatId: string) => {
    // Leave previous chat if exists
    if (selectedChatId) {
      socket.emit('leave:chat', selectedChatId);
    }
    // Join new chat
    socket.emit('join:chat', chatId);
    setSelectedChatId(chatId);
    setShowListOnMobile(false); // On mobile, go to chat view
  };

  // Handler for going back to list on mobile
  const handleBackToList = () => {
    // Leave current chat when going back to list
    if (selectedChatId) {
      socket.emit('leave:chat', selectedChatId);
    }
    setShowListOnMobile(true);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div
        className={`md:w-80 w-full border-r h-full flex-shrink-0 bg-background ${!showListOnMobile ? 'hidden' : ''} md:block`}
      >
        <ChatsList
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
        />
      </div>
      {/* Chat: show on md+ or if showListOnMobile is false */}
      <div
        className={`flex-1 h-full overflow-hidden ${showListOnMobile ? 'hidden' : ''} md:block`}
      >
        <Chat
          chatId={selectedChatId}
          onBack={handleBackToList}
          socket={socket}
        />
      </div>
    </div>
  );
}
