import EventCard from './EventCard';
import { Match } from '../../../../shared/types/Match';

import { PopulatedUser } from '../../../../shared/types/Match';
interface DesktopGridViewProps {
  weekDates: Date[];
  getEventsForDate: (date: Date) => Match[];
  dayNames: string[];
  isToday: (date: Date) => boolean;
  isPast: (date: Date) => boolean;
  currentUser: PopulatedUser | null | undefined;
  formatTime: (date: Date) => string;
}

const DesktopGridView = ({
  weekDates,
  getEventsForDate,
  dayNames,
  isToday,
  isPast,
  currentUser,
  formatTime,
}: DesktopGridViewProps) => {
  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDates.map((date) => {
        const events = getEventsForDate(date);
        return (
          <div className="min-h-40" key={date.toISOString()}>
            {/* Day header */}
            <div
              className={`
                p-3 rounded-t-lg border
                ${isToday(date) ? 'bg-primary/10 border-primary/20' : 'bg-gray-50 border-gray-200'}
              `}
            >
              <div className="text-center">
                <div className="text-sm text-gray-700 font-medium">
                  {dayNames[date.getDay()]}
                </div>
                <div
                  className={`text-lg font-semibold 
                    ${isToday(date) ? 'text-primary' : isPast(date) ? 'text-gray-400' : 'text-gray-900'}
                  `}
                >
                  {date.getDate()}
                </div>
              </div>
            </div>

            {/* Events container */}
            <div
              className={`
                min-h-32 p-2 rounded-b-lg border-l border-r border-b
                ${isToday(date) ? 'border-primary/20' : 'bg-white border-gray-200'}
              `}
            >
              {/* Events */}
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    currentUserId={currentUser?._id || ''}
                    compact={false}
                    formatTime={formatTime}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 text-sm mt-4">
                  No events
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DesktopGridView;
