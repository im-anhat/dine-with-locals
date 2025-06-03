import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, FileText } from 'lucide-react';

type MatchCardProps = {
  name: string;
  date: string;
  time: Date | string;
  description: string;
  tags: string[];
  avatar: string | null;
  initials: string;
  location?: string;
  guest?: string;
  guestAvatar?: string | null;
  guestInitials?: string;
  status?: string;
};
const MeetupCard = ({
  guest,
  time,
  location,
  description,
  status,
  tags,
  guestAvatar,
  guestInitials,
}: MatchCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card className="h-fit hover:shadow-sm transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* <div className="font-medium text-sm">{date}</div> */}
        {guest && (
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={guestAvatar ? guestAvatar : ''} alt={guest} />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                {guestInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              Guest: {guest}
            </span>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>Location: {location}</span>
          </div>
        )}
        {time && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Time: {time.toLocaleString()}</span>
          </div>
        )}
        {description && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{description}</span>
          </div>
        )}
        {status && (
          <div className="pt-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
            >
              {status}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetupCard;
