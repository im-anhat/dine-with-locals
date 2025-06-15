import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';

function UpcomingMeetup() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upcoming Meetups</h2>
          <Button
            variant="outline"
            onClick={() => navigate('/host/create-listing')}
          >
            <Calendar className="mr-2 w-4 h-4" />
            Create New Listing
          </Button>
        </div>

        <Tabs defaultValue="listing" className="w-full">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="listing">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="listing" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {/* {upcomingMeetups.map((meetup, index) => (
                <MeetupCard key={index} {...meetup} />
              ))} */}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Not finalized</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

export default UpcomingMeetup;
