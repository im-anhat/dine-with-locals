import { useState } from 'react';
import { Chat } from '../components/Chat';
import { ChatsList } from '../components/ChatsList';

export function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  // Handler for selecting a chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowListOnMobile(false); // On mobile, go to chat view
  };

  // Handler for going back to list on mobile
  const handleBackToList = () => {
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
        <Chat chatId={selectedChatId} onBack={handleBackToList} />
      </div>
    </div>
  );
}
