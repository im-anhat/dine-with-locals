// Final version with polished UI layout for Travel Schema filter form
import { useEffect, useState } from 'react';
import FilterResults from '@/components/filter/FilterResult';
import FilterBar from '../../components/filter/FilterBar';
import { DateRange } from 'react-day-picker';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
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

  const { currentUser } = useUser();

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
    let url = currentUser?.role === 'Guest' ? 'listing' : 'request';
    console.log(`${import.meta.env.VITE_API_BASE_URL}api/filter/${url}`);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/filter/${url}`,
        obj,
      );
      setResults(res.data.dataArray);
      if (res.data && Array.isArray(res.data.dataArray)) {
        setResults(res.data.dataArray);
      } else if (Array.isArray(res.data)) {
        // Fallback: direct array response
        setResults(res.data);
      } else {
        // If the response doesn't contain an array, set empty array
        console.warn('API response structure unexpected:', res.data);
        setResults([]);
      }
      console.log(results);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Load all card when reload page
  useEffect(() => {
    try {
      const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        let url = currentUser?.role === 'Guest' ? 'listing' : 'request';
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}api/${url}`,
          );
          setResults(res.data.data);

          if (res.data && Array.isArray(res.data.data)) {
            setResults(res.data.data);
            console.log(results);
          } else if (Array.isArray(res.data)) {
            // Fallback: direct array response
            setResults(res.data);
          } else {
            // If the response doesn't contain an array, set empty array
            console.warn('API response structure unexpected:', res.data);
            setResults([]);
          }
        } catch (err) {
          setError('Something went wrong. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    } catch (err) {}
  }, []);

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

        <div className="mt-6">
          {loading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {/* {!results && <FilterResults results={results ?? []} />} */}
          <FilterResults results={results ?? []} />
        </div>
      </div>
    </>
  );
};

export default FilterPage;
