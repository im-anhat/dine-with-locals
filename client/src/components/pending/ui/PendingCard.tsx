import { Button } from '@/components/ui/button';
import { PendingCardProps } from '../HostSidePending';
import { approveMatch, deleteMatch } from '@/services/MatchService';
import { getListingById } from '@/services/BookingService';
import { approveMatchWithPayment } from '@/services/PaymentService';
import { useState } from 'react';

function listingRequiresPayment(listing: any): boolean {
  return !!listing && (listing.fee > 0 || listing.price > 0);
}

function PendingCard({
  ...props
}: PendingCardProps): React.ReactElement<PendingCardProps> {
  const [loading, setLoading] = useState(false);

  // Function to handle the approval of a match
  const handleApprove = async (matchingId: string, listingIdRaw?: string) => {
    setLoading(true);
    try {
      // Get the listing (if fee required, payment must be captured BEFORE approving match)
      let listingId: string | undefined;
      if (typeof listingIdRaw === 'string') {
        listingId = listingIdRaw;
      } else if (
        listingIdRaw &&
        typeof listingIdRaw === 'object' &&
        '_id' in listingIdRaw
      ) {
        listingId = (listingIdRaw as any)._id;
      }
      let listing: any | undefined;
      if (listingId) {
        listing = await getListingById(listingId);
      }
      // If listing requires payment, approve match and capture payment intent via approveMatchWithPayment
      if (listing && listingRequiresPayment(listing)) {
        try {
          await approveMatchWithPayment(matchingId);
          console.log('Match approved and payment captured for paid listing.');
        } catch (paymentError) {
          console.error('Error capturing payment intent:', paymentError);
          setLoading(false);
          return; // Do not proceed if payment fails
        }
      } else {
        // Approve the match (no payment required)
        const updatedMatch = await approveMatch(matchingId);
        console.log('Match approved:', updatedMatch);
      }
    } catch (error) {
      console.error('Error approving match:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the rejection of a match
  const handleReject = async (matchingId: string) => {
    try {
      await deleteMatch(matchingId);
      console.log('Match rejected:', matchingId);
    } catch (error) {
      console.error('Error rejecting match:', error);
    }
  };

  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow p-6 mb-4 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between gap-10">
        {/* Left: Avatar and Name */}
        <div className="flex flex-col gap-2 items-center min-w-[180px]">
          <img
            src={props.guestId.avatar}
            className="rounded-full w-24 h-24 object-cover"
          />
          <div>
            <h2 className="font-semibold text-lg">
              {props.guestId.firstName} {props.guestId.lastName}
            </h2>
          </div>
        </div>
        {/* Middle: Bio, Tags */}
        <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
          <div>
            <h3 className="font-semibold text-sm mb-1">Bio</h3>
            <p className="text-sm text-gray-700">{props.guestId.bio}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">Tags</h3>
            <div className="flex flex-row gap-2 flex-wrap">
              <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
                {props.guestId.ethnicity}
              </span>
              {props.listingId?.dietary.map((dietaryRestriction, idx) => (
                <span
                  key={dietaryRestriction + idx}
                  className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs"
                >
                  {dietaryRestriction}
                </span>
              ))}
              {props.guestId?.hobbies.map((hobby, idx) => (
                <span
                  key={hobby + idx}
                  className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs"
                >
                  {hobby}
                </span>
              ))}
              {props.listingId?.cuisine.map((cuisine, idx) => (
                <span
                  key={cuisine + idx}
                  className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <span className="block text-xs text-gray-500">Language</span>
            {props.guestId.languages?.map((language, idx) => (
              <span key={language + idx} className="text-sm">
                {language}
              </span>
            ))}
          </div>
        </div>
        {/* Right: Notes and Actions */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          <div>
            <h3 className="font-semibold text-sm mb-1">Additional notes</h3>
            <p className="text-sm text-gray-700">{props.additionalInfo}</p>
          </div>
          <div className="flex flex-row gap-2 justify-end">
            <Button
              onClick={() => {
                console.log('clicked');
                handleApprove(
                  props._id,
                  props.listingId && '_id' in props.listingId
                    ? props.listingId._id
                    : undefined,
                );
              }}
              disabled={loading}
            >
              {loading ? 'Approving...' : 'Approve'}
            </Button>
            <Button
              onClick={() => {
                console.log('reject clicked');
                handleReject(props._id);
              }}
              className="bg-gray-200 text-gray-900"
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingCard;
