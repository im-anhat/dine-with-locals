import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import type Chat from '../../../../../shared/types/Chat';
import { useUser } from '@/contexts/UserContext';

interface ChatItemProps {
  chat: Chat;
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
}

export function ChatItem({
  chat,
  onSelectChat,
  selectedChatId,
}: ChatItemProps) {
  const { currentUser } = useUser();
  const otherParticipant = chat.users.find(
    (user) => user._id !== currentUser?._id,
  );
  return (
    <button
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
            {!chat.isGroupChat && (
              <Avatar className="absolute bottom-0 right-0 w-8 h-8 border-2 border-background">
                <AvatarImage src={otherParticipant?.avatar} />
                <AvatarFallback>
                  {otherParticipant?.firstName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          {/* Text Content (with listing) */}
          <div className="min-w-0 flex-1 text-left">
            {chat.isGroupChat ? (
              <p className="font-medium truncate">
                📣 {chat.chatName || 'Group Chat'}
              </p>
            ) : (
              <p className="font-medium truncate">
                {otherParticipant?.firstName} {otherParticipant?.lastName}
              </p>
            )}
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
                {otherParticipant?.firstName} {otherParticipant?.lastName}
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
}
