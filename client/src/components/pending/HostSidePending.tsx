import { useEffect, useState } from 'react';
import PendingCard from './ui/PendingCard';
import EventTable from './ui/EventTable';
import {
  getListingsByUserId,
  getMatchesFromListingId,
} from '../../services/ListingService';
import { useUser } from '../../contexts/UserContext';
import { ListingDetails } from '../../../../shared/types/ListingDetails';
import { User } from '../../../../shared/types/User';
import { useNavigate } from 'react-router-dom';
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
          // console.log('PAGE MATCHES', matches);
          return [listing._id, matches] as [string, PendingCardProps[]];
        }),
      );
      setMapping(Object.fromEntries(entries));
      // console.log('USE STATE MAPPING 1', mapping);
    };
    fetchMatches();
    // console.log('USE STATE MAPPING 2', mapping);
  }, [listings]);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
        Pending Approvals
      </h1>
      {/* Fetch all listing: dining, event here for host */}
      {listings?.map((listing) => {
        const isPast = listing?.time
          ? new Date(listing.time) < new Date()
          : false;

        return (
          <div key={listing._id}>
            {/* Listing portion of the code */}
            <div className="flex flex-row items-center gap-3 mb-2">
              <div
                onClick={() =>
                  navigate(`/approvals/${listing._id}`, {
                    state: { guests: mapping[listing._id] || [] },
                  })
                }
              >
                <h2
                  className={
                    isPast
                      ? 'text-lg md:text-xl font-semibold text-gray-400'
                      : 'text-lg md:text-xl font-semibold text-gray-800'
                  }
                >
                  {listing.title}
                </h2>
              </div>

              {listing.category == 'event' ? (
                <span
                  className={
                    isPast
                      ? 'bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium'
                      : 'bg-teal-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium'
                  }
                >
                  {listing.category.toUpperCase()}
                </span>
              ) : (
                <span
                  className={
                    isPast
                      ? 'bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium'
                      : 'bg-yellow-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium'
                  }
                >
                  {listing.category.toUpperCase()}
                </span>
              )}
            </div>
            {listing.category == 'event' ? (
              <EventTable guests={mapping[listing._id] || []} />
            ) : (
              <div className="mb-8">
                {mapping[listing._id]?.map((cardInfo) => (
                  <div key={cardInfo._id}>
                    <PendingCard {...cardInfo} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default HostSidePending;
