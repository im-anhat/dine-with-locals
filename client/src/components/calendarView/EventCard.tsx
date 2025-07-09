import { User, MapPin, Clock } from 'lucide-react';
import { PopulatedUser, PopulatedMatch } from '../../../../shared/types/Match';

const EventCard = ({
  event,
  compact = false,
  formatTime,
}: {
  event: PopulatedMatch;
  compact?: boolean;
  currentUserId: string;
  formatTime: (date: Date) => string;
}) => {
  // hostId and guestId can be either a string or a PopulatedUser
  console.log('EventCard event', event);

  let host: PopulatedUser = event.hostId;
  if (event.listingId) {
    host = event.hostId;
  }

  if (event.listingId === null || event.listingId === undefined) {
    return <div>No Listing</div>;
  }

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 truncate">
              {event.listingId ? event.listingId.title : ''}
              {event.requestId ? event.requestId.title : ''}
            </h4>
            <p className="text-xs text-gray-600 truncate mt-1">
              {`${host.firstName} ${host.lastName}`}
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">
                {event.listingId &&
                  `${event.listingId.locationId.city}, ${event.listingId.locationId.state}`}
                {event.requestId &&
                  `${event.requestId.locationId.city}, ${event.requestId.locationId.state}`}
              </span>
            </div>
          </div>
          <div className="text-right ml-2 flex-shrink-0">
            <p className="text-xs font-medium text-gray-900">
              {event.listingId && formatTime(event.listingId.time)}
              {event.requestId && formatTime(event.requestId.time)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-2">
        <h4 className="font-semibold text-sm text-gray-900 truncate">
          {event.listingId ? event.listingId.title : ''}
          {event.requestId ? event.requestId.title : ''}
        </h4>

        <div className="flex items-center text-xs text-gray-600">
          <User className="w-3 h-3 mr-1" />
          <span className="truncate">{`${host.firstName} ${host.lastName}`}</span>
        </div>

        <div className="flex items-center text-xs text-gray-600">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="truncate">
            {event.listingId &&
              `${event.listingId.locationId.city}, ${event.listingId.locationId.state}`}
            {event.requestId &&
              `${event.requestId.locationId.city}, ${event.requestId.locationId.state}`}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-600">
          <Clock className="w-3 h-3 mr-1" />
          <span>
            {event.listingId && formatTime(event.listingId.time)}
            {event.requestId && formatTime(event.requestId.time)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
