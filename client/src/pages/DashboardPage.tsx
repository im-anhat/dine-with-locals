import axios from 'axios';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Separator } from '@/components/ui/separator';
import FilterResults from '../components/filter/FilterResult';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import UpcomingMeetup from '../components/dashboard/UpcomingMeetup';

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>();
  const { currentUser } = useUser();

  //Use effect to load all cards from user
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
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Heading */}
      <DashboardHeader />
      <Separator />

      {/* Match Cards Section */}
      <section className="space-y-4">
        <div className="flex flex-row gap-6">
          <div>
            {loading && <p className="text-muted-foreground">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <FilterResults results={results?.slice(0, 3) ?? []} />
          </div>
        </div>
      </section>

      <Separator />

      {/* Upcoming Meetup Section */}
      <UpcomingMeetup />
    </div>
  );
};

export default DashboardPage;
