import { useState } from 'react';
import { Chat } from '../components/Chat';
import { ChatsList } from '../components/ChatsList';
import { useSocket } from '../contexts/SocketContext';

export function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  const { socket }  = useSocket();

  // Handler for selecting a chat
  const handleSelectChat = (chatId: string) => {
    if (!socket) return;

    // Leave previous chat if exists
    if (selectedChatId) {
      socket.emit('leave_chat', selectedChatId);
    }

    // Join new chat
    socket.emit('join_chat', chatId);
    setSelectedChatId(chatId);
    setShowListOnMobile(false); // On mobile, go to chat view
  };

  // Handler for going back to list on mobile
  const handleBackToList = () => {
    if (!socket || !selectedChatId) return;

    // Leave current chat when going back to list
    if (selectedChatId) {
      socket.emit('leave_chat', selectedChatId);
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

      <div
        className={`flex-1 h-full overflow-hidden ${showListOnMobile ? 'hidden' : ''} md:block`}
      >
        <Chat
          chatId={selectedChatId}
          onBack={handleBackToList}
        />
      </div>
    </div>
  );
}
