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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { date } from 'zod';
const FilterPage = () => {
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Halal',
    'Kosher',
    'Gluten-Free',
  ];
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [dietaryRestrictrions, setDietaryRestrictrions] = useState<
    string[] | undefined
  >();
  const [city, setCity] = useState<string | undefined>();
  const [dineAt, setDineAt] = useState<string | undefined>();
  const [numberOfGuests, setNumberOfGuests] = useState<number | undefined>();

  const submitValue = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault;
    const obj = {
      dateRange,
      category,
      dietaryRestrictrions,
      city,
      dineAt,
      numberOfGuests,
    };
    console.log(obj);
  };

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
        <Button onClick={submitValue}>Enter</Button>
      </div>
    </div>
  );
};

export default FilterPage;
