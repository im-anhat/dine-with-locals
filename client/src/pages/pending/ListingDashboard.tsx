import GuestDetailsCard from '@/components/dashboard/listing/GuestDetailsCard';
import GuestReviewCard from '@/components/dashboard/listing/GuestReviewCard';
import { User } from '../../../../shared/types/User';
import { ListingDetails } from '../../../../shared/types/ListingDetails';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ListingHeaderCard from '@/components/dashboard/listing/ListingHeaderCard';

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

  //Fetch listing information
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
        Listing Dashboard
      </h1>
      <div className="flex flex-row items-center gap-3 mb-2">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          {props[0].listingId?.title}
        </h2>
        <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
          {props[0].listingId?.category}
        </span>
      </div>
      {props[0]?.listingId && <ListingHeaderCard {...props[0].listingId} />}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 my-4">
        Guest details and Payment Status
      </h2>
      <GuestDetailsCard data={props} />
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 my-4">
        Guest Review
      </h2>
      <GuestReviewCard hostId={props[0].hostId} />
    </div>
  );
}

export default ListingDashboard;
