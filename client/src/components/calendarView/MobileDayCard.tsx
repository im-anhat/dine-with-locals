import { Card } from '@/components/ui/card';
import EventCard from './EventCard';
import { Match } from '../../../../shared/types/Match';

import { PopulatedUser } from '../../../../shared/types/Match';
interface MobileDayCardProps {
  day: {
    date: Date;
    events: Match[];
    dayName: string;
    isToday: boolean;
    isPast: boolean;
  };
  currentUser: PopulatedUser | null | undefined;
  formatTime: (date: Date) => string;
  formatDate: (date: Date) => string;
}

const MobileDayCard = ({
  day,
  currentUser,
  formatTime,
  formatDate,
}: MobileDayCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div
        className={`
          px-4 py-3 border-b
          ${day.isToday ? 'bg-primary/10 border-primary/20' : 'bg-gray-50 border-gray-200'}
        `}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3
              className={`
                font-semibold
                ${day.isToday ? 'text-primary' : day.isPast ? 'text-gray-400' : 'text-gray-900'}
              `}
            >
              {day.dayName}
            </h3>
            <p className="text-sm text-gray-600">{formatDate(day.date)}</p>
          </div>
          <div className="text-right">
            <span
              className={`
                text-xs px-2 py-1 rounded-full
                ${
                  day.events.length > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }
              `}
            >
              {day.events.length} event{day.events.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {day.events.length > 0 ? (
          day.events.map((event: Match) => (
            <EventCard
              key={event._id}
              event={event}
              currentUserId={currentUser?._id || ''}
              compact={true}
              formatTime={formatTime}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 text-sm py-4">
            No events scheduled
          </div>
        )}
      </div>
    </Card>
  );
};

export default MobileDayCard;
