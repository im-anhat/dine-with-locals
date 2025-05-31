// Final version with polished UI layout for Travel Schema filter form
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';

type FilterBarProps = {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  category: string | undefined;
  setCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  dietaryRestrictions: string[] | undefined;
  setDietaryRestrictions: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  city: string | undefined;
  setCity: React.Dispatch<React.SetStateAction<string | undefined>>;
  dineAt: string | undefined;
  setDineAt: React.Dispatch<React.SetStateAction<string | undefined>>;
  numberOfGuests: number | undefined;
  setNumberOfGuests: React.Dispatch<React.SetStateAction<number | undefined>>;
  onSubmit: (e: React.FormEvent<HTMLButtonElement>) => void;
};

const FilterBar = ({
  dateRange,
  setDateRange,
  category,
  setCategory,
  dietaryRestrictions,
  setDietaryRestrictions,
  city,
  setCity,
  dineAt,
  setDineAt,
  numberOfGuests,
  setNumberOfGuests,
  onSubmit,
}: FilterBarProps) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-row  gap-4">
        {/* Category */}
        <Select onValueChange={setCategory}>
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
        <Select onValueChange={setCity}>
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">Dietary Restrictions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Vegetarian</DropdownMenuItem>
            <DropdownMenuItem>Vegan</DropdownMenuItem>
            <DropdownMenuItem>Gluten-free</DropdownMenuItem>
            <DropdownMenuItem>Lactose intolerant</DropdownMenuItem>
            <DropdownMenuItem>Allergies</DropdownMenuItem>
            <DropdownMenuItem>Kosher</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Dine At */}
        <Select onValueChange={setDineAt}>
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
        <Select onValueChange={(val) => setNumberOfGuests(Number(val))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Number of Guests" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(10)].map((_, i) => (
              <SelectItem key={i} value={`${i + 1}`}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onSubmit}>Enter</Button>
      </div>
    </div>
  );
};

export default FilterBar;
