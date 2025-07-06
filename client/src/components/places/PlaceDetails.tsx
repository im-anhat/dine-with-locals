import React from 'react';
import { Listing, PopulatedLocation } from '../../../../shared/types/Listing';
import { Request } from '../../../../shared/types/Request';
import { getLocationById, Location } from '@/services/LocationService';
import { useNavigate } from 'react-router-dom';
import { startOrCreateChat } from '@/services/chat/ChatServices';
import { useSocket } from '../../contexts/SocketContext';

interface PlaceDetailsProps {
  listing?: Listing;
  request?: Request;
  onClose: () => void;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({
  listing,
  request,
  onClose,
}) => {
  const navigate = useNavigate();
  const [location, setLocation] = React.useState<Location | null>(null);

  const item = listing || request;
  const isListing = !!listing;
  const { socket } = useSocket();

  React.useEffect(() => {
    if (!item) return;

    // Check if locationId is already a populated object or just an ID string
    if (typeof item.locationId === 'object' && item.locationId !== null) {
      // locationId is already populated, convert it to the Location format
      const populatedLocation = item.locationId as PopulatedLocation;
      setLocation({
        _id: populatedLocation._id,
        address: populatedLocation.address,
        city: populatedLocation.city,
        state: populatedLocation.state,
        country: populatedLocation.country,
        zipCode: populatedLocation.zipCode,
        coordinates: populatedLocation.coordinates,
      });
    } else if (typeof item.locationId === 'string') {
      // locationId is just an ID, fetch the full location data
      getLocationById(item.locationId)
        .then(setLocation)
        .catch((error) => {
          console.error('Error fetching location by ID:', error);
          // Set a default location in case of error
          setLocation(null);
        });
    }
  }, [item]);

  if (!item) return null;

  const handleOpenChat = async () => {
    try {
      const chat = await startOrCreateChat((item.userId as any)._id, item._id); // Type assertion for userId._id

      // Emit the chat creation event to the socket server
      if (!socket) return;
      socket.emit('join_chat', chat._id);

      navigate('/chats', {
        state: { listingId: item._id, chatId: chat._id },
      });
    } catch (error) {
      console.error('Error starting or creating chat:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-brand-stone-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-brand-stone-800">
            {item?.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-brand-stone-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-brand-stone-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image or placeholder - only show for listings */}
          {isListing && (
            <div className="mb-6 rounded-lg overflow-hidden h-64 bg-brand-shell-100 flex items-center justify-center">
              {listing?.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">🍽️</span>
              )}
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                {isListing ? 'About This Experience' : 'About This Request'}
              </h3>
              <p className="text-brand-stone-600 mb-4">
                {isListing
                  ? listing?.description
                  : request?.additionalInfo ||
                    'No additional details provided.'}
              </p>

              <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                Location
              </h3>
              <p className="text-brand-stone-600 mb-4">
                {location
                  ? `${location.address}, ${location.city}, ${location.state || ''}, ${location.country}, ${location.zipCode || ''}`
                  : 'Loading location...'}
              </p>

              <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                What to Expect
              </h3>
              <ul className="list-disc pl-5 text-brand-stone-600 mb-4">
                <li>
                  {isListing
                    ? 'A warm welcome from your host'
                    : 'Looking for a host for this request'}
                  , {item.userId.firstName} {item.userId.lastName}
                </li>
                {isListing && (
                  <>
                    <li>
                      Authentic {listing?.category} experience in a local
                      setting
                    </li>
                    <li>Cultural exchange and conversation</li>
                    {listing?.duration && (
                      <li>Duration: {listing.duration} hours</li>
                    )}
                  </>
                )}
                {!isListing && request && (
                  <>
                    <li>
                      Location type preference:{' '}
                      {request.locationType === 'res'
                        ? 'Restaurant'
                        : request.locationType === 'home'
                          ? 'Home'
                          : request.locationType === 'either'
                            ? 'Wherever'
                            : request.locationType}
                    </li>
                    {request.cuisine && request.cuisine.length > 0 && (
                      <li>Cuisine interests: {request.cuisine.join(', ')}</li>
                    )}
                    {request.dietaryRestriction &&
                      request.dietaryRestriction.length > 0 && (
                        <li>
                          Dietary restrictions:{' '}
                          {request.dietaryRestriction.join(', ')}
                        </li>
                      )}
                  </>
                )}
              </ul>
            </div>

            {/* Sidebar with details and actions */}
            <div className="bg-brand-shell-100 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <span className="text-brand-stone-500">
                  {isListing
                    ? (listing?.category?.charAt(0).toUpperCase() || '') +
                      (listing?.category?.slice(1) || '')
                    : request
                      ? request.locationType === 'res'
                        ? 'Restaurant'
                        : request.locationType === 'home'
                          ? 'Home'
                          : request.locationType === 'either'
                            ? 'Wherever'
                            : request.locationType
                      : ''}
                </span>
              </div>

              {item.time && (
                <div className="mb-4">
                  <h4 className="text-sm text-brand-stone-500 mb-1">
                    {isListing ? 'Scheduled Time' : 'Requested Time'}
                  </h4>
                  <p className="text-lg font-semibold text-brand-orange-600">
                    {new Date(item.time).toLocaleDateString()}
                    {isListing &&
                      listing?.duration &&
                      ` (${listing.duration}h)`}
                  </p>
                </div>
              )}

              {item.numGuests && (
                <div className="mb-4">
                  <h4 className="text-sm text-brand-stone-500 mb-1">
                    {isListing ? 'Max Guests' : 'Number of Guests'}
                  </h4>
                  <p className="text-brand-stone-800">
                    {item.numGuests} people
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm text-brand-stone-500 mb-1">
                  {isListing ? 'Hosted by' : 'Requested by'}
                </h4>
                <p className="text-brand-stone-800">
                  {item.userId.firstName} {item.userId.lastName}
                </p>
                {item.userId.userName && (
                  <p className="text-sm text-brand-stone-600">
                    @{item.userId.userName}
                  </p>
                )}
              </div>

              <button className="w-full bg-brand-coral-300 text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-coral-500 transition-colors">
                {isListing ? 'Book This Experience' : 'Offer to Host'}
              </button>

              <button
                className="w-full mt-2 border bg-brand-coral-300 text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-coral-500 transition-colors"
                onClick={handleOpenChat}
              >
                {isListing ? 'Contact Host' : 'Contact Guest'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
