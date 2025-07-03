import { useEffect, useState } from 'react';
import PendingCard from './ui/PendingCard';
import EventTable from './ui/EventTable';
import { getListingsByUserId } from '../../services/ListingService';
import { useUser } from '../../contexts/UserContext';
import { Listing } from '../../../../shared/types/Listing';
import { ListStart } from 'lucide-react';
function HostSidePending() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const { currentUser } = useUser();
  const currUserId = currentUser?._id ?? 'undefined';
  console.log('CURR USER ID', currUserId.toString());
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
  console.log('FETCHED LISTINGS', listings);
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
              <PendingCard />
            </div>
          </div>
        );
      })}

      {/* <div className="flex flex-row items-center gap-3 mb-2 mt-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Chicago, IL - July 20: Private Goi Cuon Workshop
        </h2>
        <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
          Event
        </span>
      </div>
      <div>
        <EventTable />
      </div> */}
    </div>
  );
}

export default HostSidePending;
