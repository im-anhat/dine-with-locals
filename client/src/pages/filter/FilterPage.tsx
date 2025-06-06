// Final version with polished UI layout for Travel Schema filter form
import { useEffect, useState } from 'react';
import FilterResults from '@/components/filter/FilterResult';
import FilterBar from '../../components/filter/FilterBar';
import { DateRange } from 'react-day-picker';
import { useUser } from '../../contexts/UserContext';
import { useLocation } from 'react-router';
import axios from 'axios';

const FilterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [dietaryRestrictions, setDietaryRestrictions] = useState<
    string[] | undefined
  >();

  const [city, setCity] = useState<string | undefined>();
  const [dineAt, setDineAt] = useState<string | undefined>();
  const [numberOfGuests, setNumberOfGuests] = useState<number | undefined>();
  const [results, setResults] = useState<any[]>();
  const { state } = useLocation();

  const { currentUser } = useUser();

  //Filter document that match filter value
  const submitValue = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const obj = {
      startDate: dateRange?.from,
      endDate: dateRange?.to,
      category: category,
      dietaryRestriction: dietaryRestrictions,
      city: city,
      locationType: dineAt,
      numGuests: numberOfGuests,
    };
    console.log('CURRENT USER RESULTS', currentUser);
    let url = currentUser?.role === 'Guest' ? 'listing' : 'request';
    console.log('URL', url);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/filter/${url}`,
        obj,
      );
      setResults(res.data);
      console.log('FILTER PAGE RESULTS', results);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Load all card when reload page
  useEffect(() => {
    if (!currentUser) return;
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      let url = currentUser?.role === 'Guest' ? 'listing' : 'request';
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}api/${url}`,
        );
        console.log('URL', `${import.meta.env.VITE_API_BASE_URL}api/${url}`);
        console.log(res.data);
        setResults(res.data);
      } catch (err) {
        setError('Something went wrong. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [currentUser]);

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <FilterBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          category={category}
          setCategory={setCategory}
          dietaryRestrictions={dietaryRestrictions}
          setDietaryRestrictions={setDietaryRestrictions}
          city={city}
          setCity={setCity}
          dineAt={dineAt}
          setDineAt={setDineAt}
          numberOfGuests={numberOfGuests}
          setNumberOfGuests={setNumberOfGuests}
          onSubmit={submitValue}
        />

        <div className="mt-6 mx-8">
          {loading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <FilterResults results={results ?? []} />
        </div>
      </div>
    </>
  );
};

export default FilterPage;
