import React from 'react';

interface Sender {
  _id: string;
  firstName: string;
}

interface Message {
  _id: string;
  senderId: Sender;
  content: string;
  chat: string;
  readBy: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
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
  );
};

export default ChatMessage;
