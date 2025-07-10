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
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Slider } from '@/components/ui/slider';
import { getAllCities } from '../../services/LocationService';
import { useEffect, useState } from 'react';
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
  numberOfGuests: number[] | undefined;
  setNumberOfGuests: React.Dispatch<React.SetStateAction<number[] | undefined>>;
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
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Lactose intolerant',
    'Allergies',
    'Kosher',
  ];
  const dietaryCount = dietaryRestrictions?.length || 0;
  const [cities, setCities] = useState<string[]>([]);

  const handleDietaryRestrictionToggle = (restriction: string) => {
    const currentRestrictions = dietaryRestrictions || [];
    const isSelected = currentRestrictions.includes(restriction);

    if (isSelected) {
      setDietaryRestrictions(
        currentRestrictions.filter((r) => r !== restriction),
      );
    } else {
      setDietaryRestrictions([...currentRestrictions, restriction]);
    }
  };
  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        const result = await getAllCities();
        setCities(result);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchAllCities();
  }, []);

  console.log('CITIES:', cities);

  return (
    <div className="pt-6 w-full">
      <div className="flex flex-row gap-2 justify-center flex-wrap">
        {/* Category */}
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dining">Dining</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* City */}
        <div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Date ranges */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-gray-500">
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
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-gray-500">
                {dietaryCount > 0
                  ? `${dietaryCount} Dietary Restriction${dietaryCount !== 1 ? 's' : ''}`
                  : 'Dietary Restrictions'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {dietaryOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={dietaryRestrictions?.includes(option) || false}
                  onCheckedChange={() => handleDietaryRestrictionToggle(option)}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Dine At */}
        <div>
          <Select value={dineAt} onValueChange={setDineAt}>
            <SelectTrigger>
              <SelectValue placeholder="Dine At" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="either">Either</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Number of Guests */}
        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Number of Guests" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex gap-2 m-2">
                <Slider
                  max={50}
                  step={1}
                  value={numberOfGuests}
                  onValueChange={setNumberOfGuests}
                />
                <span className="text-gray-500">{numberOfGuests}</span>
              </div>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onSubmit}>Search</Button>
      </div>
    </div>
  );
};

export default FilterBar;
