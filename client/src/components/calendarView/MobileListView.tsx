import MobileDayCard from './MobileDayCard';
import { Match } from '../../../../shared/types/Match';

import { PopulatedUser } from '../../../../shared/types/Match';
interface MobileListViewProps {
  weekDates: Date[];
  getEventsForDate: (date: Date) => Match[];
  dayNames: string[];
  isToday: (date: Date) => boolean;
  isPast: (date: Date) => boolean;
  currentUser: PopulatedUser | null | undefined;
  formatTime: (date: Date) => string;
  formatDate: (date: Date) => string;
}

const MobileListView = ({
  weekDates,
  getEventsForDate,
  dayNames,
  isToday,
  isPast,
  currentUser,
  formatTime,
  formatDate,
}: MobileListViewProps) => {
  const allEvents = weekDates.map((date) => ({
    date,
    events: getEventsForDate(date),
    dayName: dayNames[date.getDay()],
    isToday: isToday(date),
    isPast: isPast(date),
  }));

  return (
    <div className="space-y-4">
      {allEvents.map((day, index) => (
        <MobileDayCard
          key={index}
          day={day}
          currentUser={currentUser}
          formatTime={formatTime}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default MobileListView;
