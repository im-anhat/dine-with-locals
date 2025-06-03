import React from 'react';
import { Listing } from '../../../../shared/types/Listing';

interface PlaceRecommendationsProps {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
  selectedListing?: Listing | null;
}

const PlaceRecommendations: React.FC<PlaceRecommendationsProps> = ({
  listings,
  onListingClick,
  selectedListing,
}) => {
  return (
    <div className="h-full overflow-y-auto bg-white shadow-lg rounded-lg">
      <div className="p-4 bg-brand-teal-700 text-white sticky top-0 z-10 rounded-t-lg">
        <h2 className="text-xl font-semibold">Recommended Experiences</h2>
        <p className="text-sm text-brand-teal-100 mt-1">
          {listings.length} experiences found in this area
        </p>
      </div>

      <div className="divide-y divide-brand-stone-200">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className={`p-4 cursor-pointer transition-colors duration-200 hover:bg-brand-shell-100 ${
              selectedListing?._id === listing._id
                ? 'bg-brand-shell-200 border-l-4 border-brand-orange-500'
                : ''
            }`}
            onClick={() => onListingClick && onListingClick(listing)}
          >
            <div className="flex">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden mr-4 bg-brand-shell-100 flex items-center justify-center">
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
                <h3 className="font-medium text-lg text-brand-stone-800">
                  {listing.title}
                </h3>
                <p className="text-sm text-brand-stone-500 mb-1">
                  Hosted by {listing.userId.firstName} {listing.userId.lastName}
                </p>
                <div className="flex items-center mb-1 flex-wrap gap-1">
                  <span className="text-sm text-brand-stone-500">
                    {listing.category.charAt(0).toUpperCase() +
                      listing.category.slice(1)}
                  </span>
                  {listing.numGuests && (
                    <>
                      <span className="mx-1 text-brand-stone-400">•</span>
                      <span className="text-sm text-brand-stone-500">
                        Up to {listing.numGuests} guests
                      </span>
                    </>
                  )}
                </div>
                {listing.time && (
                  <p className="text-sm font-medium text-brand-orange-600">
                    {new Date(listing.time).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-brand-stone-600 mt-2 line-clamp-2 overflow-hidden">
              {listing.description}
            </p>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-brand-stone-500">
            No listings found in this area.
          </p>
          <p className="text-sm text-brand-stone-400 mt-2">
            Try searching in a different location.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaceRecommendations;
