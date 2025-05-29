import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

function FilterBar({
  category,
  location,
  dateRange,
  dietaryRestrictrictions,
  dineAt,
  numGuests,
}: {}) {
  return (
    <>
      return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-row  gap-4">
          {/* Category */}
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dining">Dining</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
          {/* City */}
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dining">Chicago</SelectItem>
              <SelectItem value="travel">New York</SelectItem>
            </SelectContent>
          </Select>
          {/* Date ranges */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to ? (
                  `${format(dateRange.from, 'P')} - ${format(dateRange.to, 'P')}`
                ) : (
                  <span>Select Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                initialFocus
              />
            </PopoverContent>
          </Popover>{' '}
          {/* Dietary Restrictions */}
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Dietary Restrictions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="gluten-free">Gluten-free</SelectItem>
              <SelectItem value="lactose">Lactose intolerant</SelectItem>
              <SelectItem value="allergies">Allergies</SelectItem>
              <SelectItem value="kosher">Kosher</SelectItem>
            </SelectContent>
          </Select>
          {/* Dine At */}
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Dine At" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="either">Either</SelectItem>
            </SelectContent>
          </Select>
          {/* Number of Guests */}
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Number of Guests" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(10)].map((_, i) => (
                <SelectItem key={i} value={`${i + 1}`}>
                  {i + 1}
                </SelectItem>
              ))}
              <SelectItem value="10+">10+</SelectItem>
            </SelectContent>
          </Select>
          <Button>Enter</Button>
        </div>
      </div>
      );
    </>
  );
}

export default FilterBar;
