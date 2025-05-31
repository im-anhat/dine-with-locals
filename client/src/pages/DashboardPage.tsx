import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarIcon, MessageCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
const MatchCard = ({ name, date, time, description, tags = [] }: any) => (
  <Card className="w-64">
    <CardContent className="flex flex-col gap-2 p-4">
      <div className="text-center">
        <div className="text-xl font-semibold">{name}</div>
        <div className="text-sm text-muted-foreground">
          {date}, {time}
        </div>
        <div className="mt-2">{description}</div>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        {tags.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="text-xs bg-gray-200 rounded-full px-2 py-1 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        <Button variant="outline" className="text-sm px-3 py-1">
          View more
        </Button>
        <MessageCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </div>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { currentUser } = useUser();
  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold">Today's match</h1>
        <div className="flex justify-end gap-4 text-lg font-medium">
          <span>{currentUser?.role}</span>
        </div>
      </div>

      {/* Match Cards */}
      <div className="flex gap-6 flex-wrap">
        <MatchCard
          name="Nhat Le"
          date="Mar 23"
          time="8:00 pm"
          description="Looking for a friend to have Pho together in Denver!"
          tags={['tags', 'vegan']}
        />
        <MatchCard
          name="Nhat Le"
          date="Mar 23"
          time="8:00 pm"
          description="Looking for a friend to have a Thai hotpot somewhere!"
          tags={['vegan']}
        />
        <MatchCard
          name="Nhat Le"
          date="Mar 23"
          time="8:00 pm"
          description="Looking for a friend to have Pho together at my house!"
          tags={['vegan']}
        />
      </div>

      <div className="text-sm text-blue-600 underline cursor-pointer">
        More Requests...
      </div>

      {/* Upcoming Meetup Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming meet up</h2>

        <Tabs defaultValue="listing">
          <TabsList className="w-fit">
            <TabsTrigger value="listing">Listing</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="listing">
            <div className="grid grid-cols-7 gap-4 mt-4">
              {/* Example Day Cards */}
              <Card className="p-3 space-y-1">
                <div className="text-sm font-medium">mon 03/01</div>
                <div className="text-xs">Guest: Unknown</div>
                <div className="text-xs">Location: ABC</div>
                <div className="text-xs">Time: DEF</div>
                <div className="text-xs">Description: XY</div>
                <div className="text-xs text-yellow-600">Status: Waiting</div>
              </Card>
              <Card className="p-3">tue 03/02</Card>
              <Card className="p-3 space-y-1">
                <div className="text-sm font-medium">wed 03/03</div>
                <div className="text-xs">Guest: ABC</div>
                <div className="text-xs">Location: ABC</div>
                <div className="text-xs">Time: DEF</div>
                <div className="text-xs">Description: XY</div>
                <div className="text-xs text-green-600">Status: Done</div>
              </Card>
              <Card className="p-3">thu 03/04</Card>
              <Card className="p-3">fri</Card>
              <Card className="p-3">sat</Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="text-center text-muted-foreground mt-4">
              (Calendar view goes here)
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline">
            <CalendarIcon className="mr-2 w-4 h-4" /> Create A New Listing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
