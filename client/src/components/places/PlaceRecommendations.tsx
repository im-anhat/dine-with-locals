import React from 'react';
import { Listing } from '../../../../shared/types/Listing';
import { Request } from '../../../../shared/types/Request';

interface PlaceRecommendationsProps {
  listings?: Listing[];
  requests?: Request[];
  onListingClick?: (listing: Listing) => void;
  onRequestClick?: (request: Request) => void;
  selectedListing?: Listing | null;
  selectedRequest?: Request | null;
}

const PlaceRecommendations: React.FC<PlaceRecommendationsProps> = ({
  listings = [],
  requests = [],
  onListingClick,
  onRequestClick,
  selectedListing,
  selectedRequest,
}) => {
  const totalItems = listings.length + requests.length;
  const itemType = listings.length > 0 ? 'listings' : 'requests';

  return (
    <div className="h-full overflow-y-auto bg-white shadow-xl rounded-2xl border border-brand-coral-200">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-brand-coral-400 to-brand-coral-600 text-white sticky top-0 z-10 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <span className="mr-2">{listings.length > 0 ? '✨' : '🍽️'}</span>
              {listings.length > 0 ? 'Recommended Listings' : 'Guest Requests'}
            </h2>
            <p className="text-brand-coral-100 text-sm mt-1">
              {totalItems} {itemType} found in this area
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-brand-coral-100">
        {/* Render listings */}
        {listings.map((listing) => (
          <div
            key={listing._id}
            className={`p-6 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-coral-50 hover:to-transparent hover:shadow-md ${
              selectedListing?._id === listing._id
                ? 'bg-gradient-to-r from-brand-coral-100 to-brand-coral-50 border-l-4 border-brand-coral-500 shadow-md'
                : ''
            }`}
            onClick={() => onListingClick && onListingClick(listing)}
          >
            <div className="flex">
              <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden mr-4 bg-gradient-to-br from-brand-coral-100 to-brand-coral-200 flex items-center justify-center shadow-md border border-brand-coral-200">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">🍽️</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-brand-coral-800 mb-1">
                  {listing.title}
                </h3>
                <p className="text-sm text-brand-coral-600 mb-2 flex items-center">
                  <span className="mr-1">👨‍🍳</span>
                  Hosted by {listing.userId.firstName} {listing.userId.lastName}
                </p>
                <div className="flex items-center mb-2 flex-wrap gap-2">
                  <span className="bg-brand-coral-100 text-brand-coral-700 text-xs px-2 py-1 rounded-full font-medium">
                    {listing.category.charAt(0).toUpperCase() +
                      listing.category.slice(1)}
                  </span>
                  {listing.numGuests && (
                    <span className="bg-brand-coral-200 text-brand-coral-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                      <span className="mr-1">👥</span>
                      Up to {listing.numGuests} guests
                    </span>
                  )}
                </div>
                {listing.time && (
                  <p className="text-sm font-semibold text-brand-coral-600 flex items-center">
                    <span className="mr-1">📅</span>
                    {new Date(listing.time).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-brand-coral-700 mt-3 line-clamp-2 overflow-hidden leading-relaxed">
              {listing.description}
            </p>
          </div>
        ))}

        {/* Render requests */}
        {requests.map((request) => (
          <div
            key={request._id}
            className={`p-6 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-coral-50 hover:to-transparent hover:shadow-md ${
              selectedRequest?._id === request._id
                ? 'bg-gradient-to-r from-brand-coral-100 to-brand-coral-50 border-l-4 border-brand-coral-500 shadow-md'
                : ''
            }`}
            onClick={() => onRequestClick && onRequestClick(request)}
          >
            <div className="flex">
              <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden mr-4 bg-gradient-to-br from-brand-coral-100 to-brand-coral-200 flex items-center justify-center shadow-md border border-brand-coral-200">
                <span className="text-4xl">🔍</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-brand-coral-800 mb-1">
                  {request.title}
                </h3>
                <p className="text-sm text-brand-coral-600 mb-2 flex items-center">
                  <span className="mr-1">🙋‍♂️</span>
                  Requested by {request.userId.firstName}{' '}
                  {request.userId.lastName}
                </p>
                <div className="flex items-center mb-2 flex-wrap gap-2">
                  <span className="bg-brand-coral-100 text-brand-coral-700 text-xs px-2 py-1 rounded-full font-medium">
                    {request.locationType.charAt(0).toUpperCase() +
                      request.locationType.slice(1)}
                  </span>
                  {request.numGuests && (
                    <span className="bg-brand-coral-200 text-brand-coral-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                      <span className="mr-1">👥</span>
                      {request.numGuests} guests
                    </span>
                  )}
                </div>
                {request.time && (
                  <p className="text-sm font-semibold text-brand-coral-600 flex items-center">
                    <span className="mr-1">📅</span>
                    {new Date(request.time).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-brand-coral-700 mt-3 line-clamp-2 overflow-hidden leading-relaxed">
              {request.additionalInfo || 'No additional details provided.'}
            </p>
          </div>
        ))}
      </div>

      {totalItems === 0 && (
        <div className="p-12 text-center">
          <div className="bg-gradient-to-br from-brand-coral-100 to-brand-coral-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">
              {listings.length === 0 && requests.length === 0 ? '🔍' : '📍'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-brand-coral-700 mb-2">
            No {itemType} found
          </h3>
          <p className="text-brand-coral-600 mb-2">
            No {itemType} found in this area.
          </p>
          <p className="text-sm text-brand-coral-500">
            Try searching in a different location or adjusting your search
            radius.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaceRecommendations;
