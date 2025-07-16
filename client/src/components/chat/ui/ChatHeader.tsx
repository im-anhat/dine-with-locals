import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, Video, Info, Phone, Megaphone } from 'lucide-react';
import { useMediaQuery } from '@custom-react-hooks/use-media-query';
import { DrawerTrigger } from '@/components/ui/drawer';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type Chat from '../../../../../shared/types/Chat.js';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext.js';

interface ChatHeaderProps {
  isGroupChat?: boolean;
  chatInfo?: Chat;
  onBack?: () => void;
  showDetails?: boolean;
  onToggleDetails?: () => void;
  hasListing?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatInfo,
  onBack,
  showDetails,
  onToggleDetails,
  isGroupChat,
  hasListing,
}) => {
  const { currentUser } = useUser();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const otherUsers = chatInfo?.isGroupChat
    ? chatInfo?.users.filter((user) => user._id !== chatInfo?.groupAdmin)
    : chatInfo?.users.filter((user) => user._id !== currentUser?._id);

  const handleProfileClick = () => {
    if (otherUsers && otherUsers[0]?._id) {
      navigate(`/profile/${otherUsers[0]._id}`, {
        state: { userId: otherUsers[0]._id },
      });
    }
  };

  return (
    <div className="border-b py-3 px-6 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {/* Back button for mobile */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden flex items-center hover:bg-muted p-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* User Avatar and Info */}
        {!isGroupChat && (
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80"
            onClick={handleProfileClick}
            title="View profile"
          >
            <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm">
              <AvatarImage src={otherUsers?.[0]?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {otherUsers?.[0]?.firstName
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-semibold text-lg leading-tight min-w-16">
              {otherUsers?.[0]?.firstName} {otherUsers?.[0]?.lastName}
            </h1>
          </div>
        )}

        {isGroupChat && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                <Megaphone />
                <h1 className="font-semibold text-lg leading-tight min-w-16">
                  <span
                    className="sm:max-w-32 md:max-w-64 truncate inline-block align-bottom"
                    title={chatInfo?.chatName}
                  >
                    {chatInfo?.chatName}
                  </span>
                </h1>
              </div>
            </DialogTrigger>
            <DialogContent className="max-h-96 overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Listing Participants</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-4 overflow-y-auto">
                {chatInfo?.users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                    onClick={() =>
                      navigate(`/profile/${user._id}`, {
                        state: { userId: user._id },
                      })
                    }
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.firstName
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        @{user.userName}
                      </span>
                    </div>
                    <div className="ml-auto">
                      {user.role === 'Host' ? (
                        <Badge>Host</Badge>
                      ) : (
                        <Badge variant="outline">Guest</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Action buttons */}

      <div className="flex items-center gap-2">
        {/* Experience Details Toggle */}
        {isMobile && hasListing && (
          <DrawerTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </DrawerTrigger>
        )}

        {!isMobile && hasListing && (
          <button
            onClick={onToggleDetails}
            className={`p-2 rounded-lg transition-colors ${
              showDetails
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title={
              showDetails
                ? 'Hide experience details'
                : 'Show experience details'
            }
          >
            <Info className="w-5 h-5" />
          </button>
        )}

        {/* Video Call button */}
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Video className="w-5 h-5" />
        </button>

        {/* Phone Call button */}
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
