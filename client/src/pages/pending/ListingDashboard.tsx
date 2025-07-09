import GuestDetailsCard from '@/components/dashboard/listing/GuestDetailsCard';
import GuestReviewCard from '@/components/dashboard/listing/GuestReviewCard';
import { User } from '../../../../shared/types/User';
import { ListingDetails } from '../../../../shared/types/ListingDetails';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ListingHeaderCard from '@/components/dashboard/listing/ListingHeaderCard';
import GuestCard from '../../components/dashboard/listing/GuestCard';
import { getListingById } from '../../services/ListingService';
import { useState } from 'react';
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
}
function ListingDashboard() {
  const location = useLocation();
  const props: PendingCardProps[] = location.state?.guests || [];
  const [listing, setListing] = useState<ListingDetails>();
  console.log('PROPS in LISTING DASHBOARD', props);

  useEffect(() => {
    console.log('DEBUG guests:', props);
    console.log('DEBUG listingId:', props[0]?.listingId?._id);
    const fetchListing = async (listingId: string) => {
      try {
        const result = await getListingById(listingId);
        console.log('DEBUG fetched listing:', result);
        setListing(result);
      } catch (err) {
        console.error('Failed fetching listing', err);
      }
    };

    if (props[0]?.listingId?._id) {
      fetchListing(props[0].listingId._id);
    }
  }, [props]);

  console.log('CURR LISTING', listing);

  //Fetch listing information
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
        Listing Dashboard
      </h1>

      {listing && <ListingHeaderCard {...listing} />}

      <h2 className="text-lg md:text-xl font-semibold text-gray-800 my-4">
        Approve pending guests
      </h2>
      <GuestCard items={props} />

      <h2 className="text-lg md:text-xl font-semibold text-gray-800 my-4">
        Guest details and Payment Status
      </h2>
      <GuestDetailsCard data={props} />

      <h2 className="text-lg md:text-xl font-semibold text-gray-800 my-4">
        Guest Review
      </h2>
      {props[0] ? (
        <GuestReviewCard hostId={props[0].hostId} />
      ) : (
        <div>No Review</div>
      )}
    </div>
  );
}

export default ListingDashboard;
