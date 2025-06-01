import React, { useEffect, useState } from 'react';
import MapLoader from '../components/places/MapLoader';
import PlacesMap from '../components/places/PlacesMap';
import PlaceRecommendations from '../components/places/PlaceRecommendations';
import PlaceDetails from '../components/places/PlaceDetails';
import { dummyListings, Listing } from '../data/dummyListings';
import { useUserContext } from '../hooks/useUserContext';
import { getLngLatFromLocationId } from '../services/LocationService';
import { set } from 'date-fns';
import { get } from 'http';

const Places: React.FC = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { currentUser } = useUserContext();
  const userLocationId = currentUser?.locationId;
  const [userCoordinates, setUserCoordinates] =
    useState<google.maps.LatLngLiteral | null>(null);
  console.log('Current User:', currentUser);
  useEffect(() => {
    const fetchUserCoordinates = async () => {
      if (userLocationId) {
        try {
          const coordinates = await getLngLatFromLocationId(userLocationId);
          setUserCoordinates(coordinates);
        } catch (error) {
          console.error('Error fetching user coordinates:', error);
        }
      }
    };

    fetchUserCoordinates();
  }, []);

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-brand-shell-100">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-brand-stone-800 mb-6">
          Find Interesting Destinations Near You
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg">
            <MapLoader>
              <PlacesMap
                listings={dummyListings}
                onListingClick={handleListingClick}
                selectedListing={selectedListing}
                userCoordinates={userCoordinates}
              />
            </MapLoader>
          </div>

          <div className="max-h-[calc(100vh-10rem)] overflow-auto">
            <PlaceRecommendations
              listings={dummyListings}
              onListingClick={handleListingClick}
              selectedListing={selectedListing}
            />
          </div>
        </div>
      </div>

      {showDetails && selectedListing && (
        <PlaceDetails listing={selectedListing} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default Places;
