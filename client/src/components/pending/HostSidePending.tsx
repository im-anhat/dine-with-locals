import { useEffect, useState } from 'react';
import PendingCard from './ui/PendingCard';
// import EventTable from './ui/EventTable';
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
import { usePendingMapping } from '../../contexts/PendingMappingContext';
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
  const [type, setType] = useState<string>('dining');
  const [listings, setListings] = useState<ListingDetails[] | null>(null);
  const { mapping, setMapping } = usePendingMapping();

  const { currentUser } = useUser();
  const currUserId = currentUser?._id ?? 'undefined';
  const navigate = useNavigate();

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
                {listings
                  ?.filter((listing) => listing.category === type)
                  .map((listing) => (
                    <TableRow key={listing._id}>
                      {/* Listing Column */}
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar
                            className="h-16 w-16 rounded-lg"
                            onClick={() =>
                              navigate(`/approvals/${listing._id}`)
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
                                ? new Date(listing.time).toLocaleDateString()
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
                            <DropdownMenuItem>Edit Listing</DropdownMenuItem>
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
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default HostSidePending;
