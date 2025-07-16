import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import FilterResults from '../components/filter/FilterResult';
import WeeklyCalendar from '../components/calendarView/WeeklyCalendar';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { getLngLatFromLocationId } from '@/services/LocationService';
import { PopulatedMatch } from '../../../shared/types/Match';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>();
  const { currentUser } = useUser();
  //dan/match-guest-host-frontend

  // state for MatchCalendar
  const [matches, setMatches] = useState<PopulatedMatch[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      let url =
        currentUser?.role === 'Guest' ? 'listing/nearby' : 'request/nearby';
      try {
        const { lng, lat } = await getLngLatFromLocationId(
          currentUser.locationId,
        );
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}api/${url}/`,
          {
            params: {
              lat: lat,
              lng: lng,
              distance: 80,
            },
          },
        );
        console.log('Result', res.data);
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

  console.log('CurrentUser', currentUser);

  // Fetch all matches for current user
  useEffect(() => {
    if (!currentUser) return;
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}api/matches/${currentUser._id}`,
        );
        console.log('Fetched matches:', response.data);
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [currentUser]);

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  //Load all card when reload page

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today's Matches</h1>
          <p className="text-muted-foreground mt-1">
            Find new connections and upcoming meetups
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {currentUser?.role}
          </div>
        </div>
      </div>

      <Separator />

      {/* Match Cards Section */}
      <section className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div>
            <div className="flex flex-row justify-center items-center gap-6">
              <FilterResults results={results?.slice(0, 3) ?? []} />
            </div>

            <Button
              variant="link"
              className="mx-2 text-brand-teal-600 p-0 h-auto font-normal mt-4"
              onClick={() => navigate('/filter', { state: { results } })}
            >
              View all
              {currentUser.role === 'Guest' ? ' listings' : ' requests'} →
            </Button>
          </div>
        )}
      </section>

      <Separator />

      {/* Upcoming Meetup Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upcoming Meetups</h2>
          {currentUser?.role === 'Host' ? (
            <Button onClick={() => navigate('/create-listing')}>
              <Calendar className="mr-2 w-4 h-4" />
              Create New Listing
            </Button>
          ) : (
            <Button onClick={() => navigate('/create-request')}>
              <Calendar className="mr-2 w-4 h-4" />
              Create New Request
            </Button>
          )}
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="listing">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <WeeklyCalendar matches={matches} />
          </TabsContent>

          <TabsContent value="listing" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {/* {upcomingMeetups.map((meetup, index) => (
                <MeetupCard key={index} {...meetup} />
              ))} */}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default DashboardPage;
