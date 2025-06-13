import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, Video, Info, Phone } from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
}

interface ChatHeaderProps {
  otherUser?: User;
  onBack?: () => void;
  showDetails?: boolean;
  onToggleDetails?: () => void;
  hasListing?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  otherUser, 
  onBack, 
  showDetails, 
  onToggleDetails, 
  hasListing 
}) => {
  return (
    <div className="border-b py-4 px-6 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm">
            <AvatarImage src={otherUser?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {otherUser?.firstName?.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg leading-tight">
              {otherUser?.firstName} {otherUser?.lastName}
            </h1>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Experience Details Toggle */}
        {hasListing && onToggleDetails && (
          <button
            onClick={onToggleDetails}
            className={`p-2 rounded-lg transition-colors ${
              showDetails 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title={showDetails ? 'Hide experience details' : 'Show experience details'}
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
