import React from 'react';
import { Listing } from '../../data/dummyListings';

interface PlaceDetailsProps {
  listing: Listing;
  onClose: () => void;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ listing, onClose }) => {
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
          {/* Image */}
          <div className="mb-6 rounded-lg overflow-hidden h-64">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
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
                This dining experience is located in New York City. The exact
                address will be shared after booking.
              </p>

              <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                What to Expect
              </h3>
              <ul className="list-disc pl-5 text-brand-stone-600 mb-4">
                <li>A warm welcome from your host, {listing.hostName}</li>
                <li>Authentic {listing.cuisine} cuisine in a local setting</li>
                <li>Cultural exchange and conversation</li>
                <li>Recipes to take home</li>
              </ul>
            </div>

            {/* Sidebar with pricing and booking */}
            <div className="bg-brand-shell-100 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{listing.rating}</span>
                <span className="mx-1 text-brand-stone-400">•</span>
                <span className="text-brand-stone-500">{listing.cuisine}</span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm text-brand-stone-500 mb-1">
                  Price per person
                </h4>
                <p className="text-2xl font-semibold text-brand-orange-600">
                  ${listing.price}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm text-brand-stone-500 mb-1">Hosted by</h4>
                <p className="text-brand-stone-800">{listing.hostName}</p>
              </div>

              <button className="w-full bg-brand-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-teal-700 transition-colors">
                Book This Experience
              </button>

              <button className="w-full mt-2 border border-brand-teal-600 text-brand-teal-600 py-3 px-4 rounded-lg font-medium hover:bg-brand-teal-50 transition-colors">
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
