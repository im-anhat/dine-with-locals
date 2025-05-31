// Final version with polished UI layout for Travel Schema filter form
import { useState } from 'react';
import FilterResults from '@/components/filter/FilterResult';
import FilterBar from '../../components/filter/FilterBar';
import { DateRange } from 'react-day-picker';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';

const FilterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [dietaryRestrictrions, setDietaryRestrictrions] = useState<
    string[] | undefined
  >();
  const [city, setCity] = useState<string | undefined>();
  const [dineAt, setDineAt] = useState<string | undefined>();
  const [numberOfGuests, setNumberOfGuests] = useState<number | undefined>();
  const [results, setResults] = useState<any[]>();
  const { currentUser } = useUser();

  const submitValue = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const obj = {
      dateRange,
      category,
      dietaryRestrictrions,
      city,
      dineAt,
      numberOfGuests,
    };
    let url = currentUser?.role === 'Guest' ? 'request' : 'listing';
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/filter/${url}`,
        obj,
      );
      setResults(res.data);
      console.log(res);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FilterBar
        dateRange={dateRange}
        setDateRange={setDateRange}
        category={category}
        setCategory={setCategory}
        dietaryRestrictions={dietaryRestrictrions}
        setDietaryRestrictions={setDietaryRestrictrions}
        city={city}
        setCity={setCity}
        dineAt={dineAt}
        setDineAt={setDineAt}
        numberOfGuests={numberOfGuests}
        setNumberOfGuests={setNumberOfGuests}
        onSubmit={submitValue}
      />

      <div className="mt-6">
        {loading && <p className="text-muted-foreground">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <FilterResults results={results ?? []} />
      </div>
    </>
  );
};

export default FilterPage;
