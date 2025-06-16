import React from 'react';
import { Listing, PopulatedLocation } from '../../../../shared/types/Listing';
import { getLocationById, Location } from '@/services/LocationService';
import { useNavigate } from 'react-router-dom';
import { startOrCreateChat } from '@/services/chat/ChatServices';
import { useSocket } from '../../contexts/SocketContext';

interface PlaceDetailsProps {
  listing: Listing;
  onClose: () => void;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ listing, onClose }) => {
  const navigate = useNavigate();
  const [location, setLocation] = React.useState<Location | null>(null);
  const { socket } = useSocket();

  React.useEffect(() => {
    // Check if locationId is already a populated object or just an ID string
    if (typeof listing.locationId === 'object' && listing.locationId !== null) {
      // locationId is already populated, convert it to the Location format
      const populatedLocation = listing.locationId as PopulatedLocation;
      setLocation({
        _id: populatedLocation._id,
        address: populatedLocation.address,
        city: populatedLocation.city,
        state: populatedLocation.state,
        country: populatedLocation.country,
        zipCode: populatedLocation.zipCode,
        coordinates: populatedLocation.coordinates,
      });
    } else if (typeof listing.locationId === 'string') {
      // locationId is just an ID, fetch the full location data
      getLocationById(listing.locationId)
        .then(setLocation)
        .catch((error) => {
          console.error('Error fetching location by ID:', error);
          // Set a default location in case of error
          setLocation(null);
        });
    }
  }, [listing]);

  const handleOpenChat = async () => {
    try {
      const chat = await startOrCreateChat(listing.userId._id, listing._id); // neu co eslint error mn ke nhe

      // Emit the chat creation event to the socket server
      if (!socket) return;
      socket.emit('join_chat', chat._id);

      navigate('/chats', {
        state: { listingId: listing._id, chatId: chat._id },
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
            {listing.title}
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
          {/* Image or placeholder */}
          <div className="mb-6 rounded-lg overflow-hidden h-64 bg-brand-shell-100 flex items-center justify-center">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">🍽️</span>
            )}
          </div>

          {/* Listing details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                About This Experience
              </h3>
              <p className="text-brand-stone-600 mb-4">{listing.description}</p>

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
                  A warm welcome from your host, {listing.userId.firstName}{' '}
                  {listing.userId.lastName}
                </li>
                <li>
                  Authentic {listing.category} experience in a local setting
                </li>
                <li>Cultural exchange and conversation</li>
                {listing.duration && (
                  <li>Duration: {listing.duration} hours</li>
                )}
                {listing.additionalInfo && <li>{listing.additionalInfo}</li>}
              </ul>
            </div>

            {/* Sidebar with experience details and booking */}
            <div className="bg-brand-shell-100 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <span className="text-brand-stone-500">
                  {listing.category.charAt(0).toUpperCase() +
                    listing.category.slice(1)}
                </span>
              </div>

              {listing.time && (
                <div className="mb-4">
                  <h4 className="text-sm text-brand-stone-500 mb-1">
                    Scheduled Time
                  </h4>
                  <p className="text-lg font-semibold text-brand-orange-600">
                    {new Date(listing.time).toLocaleDateString()}
                    {listing.duration && ` (${listing.duration}h)`}
                  </p>
                </div>
              )}

              {listing.numGuests && (
                <div className="mb-4">
                  <h4 className="text-sm text-brand-stone-500 mb-1">
                    Max Guests
                  </h4>
                  <p className="text-brand-stone-800">
                    {listing.numGuests} people
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm text-brand-stone-500 mb-1">Hosted by</h4>
                <p className="text-brand-stone-800">
                  {listing.userId.firstName} {listing.userId.lastName}
                </p>
                {listing.userId.userName && (
                  <p className="text-sm text-brand-stone-600">
                    @{listing.userId.userName}
                  </p>
                )}
              </div>

              <button className="w-full bg-brand-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-teal-700 transition-colors">
                Book This Experience
              </button>

              <button
                className="w-full mt-2 border border-brand-teal-600 text-brand-teal-600 py-3 px-4 rounded-lg font-medium hover:bg-brand-teal-50 transition-colors"
                onClick={handleOpenChat}
              >
                Contact Host
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
