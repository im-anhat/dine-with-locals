import { useEffect, useState } from 'react';
import PendingCard from './ui/PendingCard';
import {
  getListingsByUserId,
  getMatchesFromListingId,
} from '../../services/ListingService';
import { Match } from '../../services/ListingService';
import { useUser } from '../../contexts/UserContext';
import { Listing } from '../../../../shared/types/Listing';
import { getMatches } from '../../services/MatchService';
import { User } from '../../../../shared/types/User';

export type PendingCardProps = Pick<
  User,
  | 'userName'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'avatar'
  | 'hobbies'
  | 'cuisines'
  | 'ethnicity'
  | 'bio'
  | 'cover'
> & {
  dietary?: string[];
  additionalNotes?: string;
  languages?: string[];
  status: 'pending' | 'approved';
  time: Date;
};

function HostSidePending() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  //Mapping is a dictionary map a listingID in line 31 to a List of Matches, get user information in the match using .populate()
  //OR create another API endpoint to get all user information in each match.
  const [mapping, setMapping] = useState<Record<string, Match[]>>({});
  const { currentUser } = useUser();
  const currUserId = currentUser?._id ?? 'undefined';

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
          return [listing._id, matches] as [string, Match[]];
        }),
      );
      setMapping(Object.fromEntries(entries));
    };

    fetchMatches();
    console.log(mapping);
  }, [listings]);

  //Get the maatches -> user of each listing
  // const fetchMatches = async (listingId: string) => {
  //   const matches = await getMatches(
  //     currentUser?._id ?? null,
  //     null,
  //     listingId ?? null,
  //     null,
  //   );
  //   return matches;
  // };

  // const matches: matchGuestInfo =
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
          <div>
            <div
              key={listing._id}
              className="flex flex-row items-center gap-3 mb-2"
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
            <div className="mb-8">
              {/* <PendingCard {...currentMatches} /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HostSidePending;
