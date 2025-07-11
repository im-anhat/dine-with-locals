import GuestDetailsCard from '@/components/dashboard/listing/GuestDetailsCard';
import GuestReviewCard from '@/components/dashboard/listing/GuestReviewCard';
import { User } from '../../../../shared/types/User';
import { Listing } from '../../../../shared/types/Listing';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ListingHeaderCard from '@/components/dashboard/listing/ListingHeaderCard';
import GuestCard from '../../components/dashboard/listing/GuestCard';
import { getListingById } from '../../services/ListingService';
import { PendingCardProps } from '../../contexts/PendingMappingContext';
import { useState } from 'react';
import { useParams } from 'react-router';
import { usePendingMapping } from '../../contexts/PendingMappingContext';

function ListingDashboard() {
  const { id: listingId } = useParams<{ id: string }>();
  // const listingId = params.listingId as string | undefined;
  const [matchesData, setMatchesData] = useState<PendingCardProps[]>();
  const [listing, setListing] = useState<Listing>();
  const { mapping, setMapping } = usePendingMapping();

  useEffect(() => {
    const getValueFromMapping = async (listingId: string | undefined) => {
      if (!listingId) return;
      const data = mapping[listingId];
      const result = await getListingById(listingId);
      setMatchesData(data);
      setListing(result);
    };
    getValueFromMapping(listingId);
  }, [listingId, mapping]);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
        Listing Dashboard
      </h1>

      {listing && <ListingHeaderCard {...listing} />}

      <h2 className="text-lg md:text-xl font-semibold text-gray-800 my-4">
        Approve pending guests
      </h2>
      {listingId && <GuestCard listingId={listingId} />}

      <h2 className="text-lg md:text-xl font-semibold text-gray-800 my-4">
        Guest details and Payment Status
      </h2>
      {listingId && <GuestDetailsCard listingId={listingId} />}

      <h2 className="text-lg md:text-xl font-semibold text-gray-800 my-4">
        Guest Review
      </h2>
      {matchesData && matchesData[0] ? (
        <GuestReviewCard hostId={matchesData[0].hostId} />
      ) : (
        <div>No Review</div>
      )}
    </div>
  );
}

export default ListingDashboard;
