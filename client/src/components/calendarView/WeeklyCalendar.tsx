import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Match } from '../../../../shared/types/Match';
import { useMediaQuery } from '@custom-react-hooks/use-media-query';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import EventCard from './EventCard';
import MobileDayCard from './MobileDayCard';
import MobileListView from './MobileListView';
import DesktopGridView from './DesktopGridView';

interface WeeklyCalendarProps {
  matches: Match[];
}

interface DayData {
  date: Date;
  events: Match[];
  dayName: string;
  isToday: boolean;
  isPast: boolean;
}

const WeeklyCalendar = ({ matches }: WeeklyCalendarProps) => {
  const { currentUser } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  console.log('Selected date', selectedDate);

  // Utility functions
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay();
    const diff = startDate.getDate() - dayOfWeek;

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate.setDate(diff + i));
      week.push(new Date(day));
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  // prop for columns
  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isPast = (date: Date) => date < new Date() && !isToday(date);

  const getEventsForDate = (date: Date) => {
    return matches.filter((match) => {
      const matchDate = new Date(
        match.listingId?.time || match.requestId?.time || '',
      );
      return matchDate.toDateString() === date.toDateString();
    });
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];
    return today >= weekStart && today <= weekEnd;
  };

  // ...components moved to their own files...

  return (
    <div className="w-full p-4">
      {/* Header - responsive */}
      <div
        className={`
        flex items-center justify-between mb-6
        ${isMobile ? 'flex-col space-y-4' : ''}
      `}
      >
        <div className="flex items-center space-x-4 justify-between w-full">
          <h1
            className={`
            font-bold text-gray-900
            ${isMobile ? 'text-xl' : 'text-2xl'}
          `}
          >
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
            {isCurrentWeek() && (
              <span className="ml-2 text-primary font-medium">
                (Current Week)
              </span>
            )}
          </h1>

          <div className="flex items-center space-x-2 relative">
            <Button
              variant="outline"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`
              flex items-center space-x-2
              ${isMobile ? 'text-sm' : ''}
            `}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Jump to Date</span>
            </Button>

            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 z-10">
                <Calendar
                  animate
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }
                  }}
                  className="rounded-md border shadow-sm"
                />
              </div>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek(-1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek(1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar view - responsive */}
      {isMobile ? (
        <MobileListView
          weekDates={weekDates}
          getEventsForDate={getEventsForDate}
          dayNames={dayNames}
          isToday={isToday}
          isPast={isPast}
          currentUser={currentUser}
          formatTime={formatTime}
          formatDate={formatDate}
        />
      ) : (
        <DesktopGridView
          weekDates={weekDates}
          getEventsForDate={getEventsForDate}
          dayNames={dayNames}
          isToday={isToday}
          isPast={isPast}
          currentUser={currentUser}
          formatTime={formatTime}
        />
      )}
    </div>
  );
};

export default WeeklyCalendar;
