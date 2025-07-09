import { useEffect, useState } from 'react';
import PendingCard from './ui/PendingCard';
import EventTable from './ui/EventTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '../../contexts/UserContext';
import { ListingDetails } from '../../../../shared/types/ListingDetails';
import { User } from '../../../../shared/types/User';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Calendar, MapPin, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GuestCard from '../dashboard/listing/GuestCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getListingsByUserId,
  getMatchesFromListingId,
} from '../../services/ListingService';

export interface PendingCardProps {
  _id: string;
  hostId: string;
  guestId: Omit<User, 'password' | 'provider'>;
  listingId?: ListingDetails;
  requestId?: string;
  status: 'pending' | 'approved';
  time: Date;
  additionalInfo: string;
  hostInfo: string;
  paymentStatus?: 'pending' | 'succeeded';
}
function HostSidePending() {
  const [type, setType] = useState<String>('dining');
  const [listings, setListings] = useState<ListingDetails[] | null>(null);
  //Mapping is a dictionary map a listingID in line 31 to a List of Matches, get user information in the match using .populate()
  //OR create another API endpoint to get all user information in each match.
  const [mapping, setMapping] = useState<Record<string, PendingCardProps[]>>(
    {},
  );
  const { currentUser } = useUser();
  const currUserId = currentUser?._id ?? 'undefined';
  const navigate = useNavigate();

  console.log('MAPPING', mapping);

  //Fetch all listings of the host, displayed as title on the page
  useEffect(() => {
    if (!currentUser) return;
    const fetchUserListing = async () => {
      const returnedListings = await getListingsByUserId(
        currUserId?.toString(),
      );
      setListings(returnedListings);
    };
    fetchUserListing();
  }, []);

  //Populate listingID, Match to mapping record
  useEffect(() => {
    const fetchMatches = async () => {
      if (!listings) return;
      const entries = await Promise.all(
        listings.map(async (listing) => {
          const matches = await getMatchesFromListingId(listing._id);
          return [listing._id, matches] as [string, PendingCardProps[]];
        }),
      );
      setMapping(Object.fromEntries(entries));
    };
    fetchMatches();
  }, [listings]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'waiting':
        return 'secondary';
      case 'approved':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
        Your Listings
      </h1>
      <div className="inline-flex flex-row gap-2 p-1 rounded-full bg-gray-100 w-[155px] mb-8">
        <Button
          className={`${type === 'event' ? 'bg-brand-shell-100 text-gray-900' : ''} rounded-full shrink-0 `}
          onClick={() => setType('dining')}
        >
          Dining
        </Button>
        <Button
          className={`${type === 'dining' ? 'bg-brand-shell-100 text-gray-900' : ''} rounded-full shrink-0 `}
          onClick={() => setType('event')}
        >
          Event
        </Button>
      </div>
      {listings?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 text-lg">No listings found.</p>
            <p className="text-gray-500 mt-2">
              Create your first listing to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings?.map((listing) => {
                  console.log('STATUS', listing.status);
                  return (
                    <>
                      {listing.category === type && (
                        <TableRow key={listing._id}>
                          {/* Listing Column */}
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar
                                className="h-16 w-16 rounded-lg"
                                onClick={() =>
                                  navigate(`/approvals/${listing._id}`, {
                                    state: {
                                      guests: mapping[listing._id] || [],
                                    },
                                  })
                                }
                              >
                                <AvatarImage
                                  src={listing.images?.[0]}
                                  alt={listing.title}
                                />
                                <AvatarFallback>
                                  {listing.title.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p
                                  className="font-medium text-gray-900 line-clamp-1"
                                  onClick={() =>
                                    navigate(`/approvals/${listing._id}`, {
                                      state: {
                                        guests: mapping[listing._id] || [],
                                      },
                                    })
                                  }
                                >
                                  {listing.title}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {listing.time
                                    ? new Date(
                                        listing.time,
                                      ).toLocaleDateString()
                                    : 'Date not available'}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Location Column */}
                          <TableCell>
                            <div className="flex items-center text-gray-700">
                              <MapPin className="h-4 w-4 mr-1" />
                              {listing.locationId.address ||
                                'Location not specified'}
                            </div>
                          </TableCell>

                          {/* Status Column */}
                          <TableCell>
                            <Badge variant={getStatusVariant(listing.status)}>
                              {listing.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>

                          {/* Actions Column */}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/approvals/${listing._id}`, {
                                      state: {
                                        guests: mapping[listing._id] || [],
                                      },
                                    })
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Edit Listing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  View Applications
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Delete Listing
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default HostSidePending;

// <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-8">
//       <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
//         Pending Approvals
//       </h1>
//       {/* Toggle between Event and Dining */}
//       {/* Toggle between Event and Dining */}
// <div className="inline-flex flex-row gap-2 p-1 rounded-full bg-gray-100 w-[155px] mb-8">
//   <Button
//     className={`${type === 'event' ? 'bg-brand-shell-100 text-gray-900' : ''} rounded-full shrink-0 `}
//     onClick={() => setType('dining')}
//   >
//     Dining
//   </Button>
//   <Button
//     className={`${type === 'dining' ? 'bg-brand-shell-100 text-gray-900' : ''} rounded-full shrink-0 `}
//     onClick={() => setType('event')}
//   >
//     Event
//   </Button>
// </div>
//       {/* Fetch all listing: dining, event here for host */}
//       {listings?.map((listing) => {
//         const isPast = listing?.time
//           ? new Date(listing.time) < new Date()
//           : false;

//         return (
//           <>
//             {listing.category === type && (
//               <div key={listing._id}>
//                 {/* Listing portion of the code */}
//                 <div className="flex flex-row items-center gap-3 mb-2">
//                   <div
//                     onClick={() =>
//                       navigate(`/approvals/${listing._id}`, {
//                         state: { guests: mapping[listing._id] || [] },
//                       })
//                     }
//                   >
//                     <h2
//                       className={
//                         isPast
//                           ? 'text-lg md:text-xl font-semibold text-gray-400'
//                           : 'text-lg md:text-xl font-semibold text-gray-800'
//                       }
//                     >
//                       {listing.title}
//                     </h2>
//                   </div>

//                   {listing.category == 'event' ? (
//                     <span
//                       className={
//                         isPast
//                           ? 'bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium'
//                           : 'bg-teal-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium'
//                       }
//                     >
//                       {listing.category.toUpperCase()}
//                     </span>
//                   ) : (
//                     <span
//                       className={
//                         isPast
//                           ? 'bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium'
//                           : 'bg-yellow-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium'
//                       }
//                     >
//                       {listing.category.toUpperCase()}
//                     </span>
//                   )}
//                 </div>
//                 {listing.category == 'event' ? (
//                   <EventTable guests={mapping[listing._id] || []} />
//                 ) : (
//                   <div className="mb-8">
//                     <ScrollArea className="h-[250px] rounded-md p-4">
//                       <div className="flex flex-col gap-2">
//                         {mapping[listing._id]?.map((cardInfo) => (
//                           <div key={cardInfo._id}>
//                             <GuestCard {...cardInfo} />
//                           </div>
//                         ))}
//                       </div>
//                     </ScrollArea>
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
//         );
//       })}
//     </div>
