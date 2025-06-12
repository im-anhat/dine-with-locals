import React, { useEffect, useState } from 'react';
import MapLoader from '../components/places/MapLoader';
import PlacesMap from '../components/places/PlacesMap';
import PlaceRecommendations from '../components/places/PlaceRecommendations';
import PlaceDetails from '../components/places/PlaceDetails';
// import { dummyListings, Listing } from '../data/dummyListings';
import { Listing } from '../../../shared/types/Listing';
import { Request } from '../../../shared/types/Request';
import { useUserContext } from '../hooks/useUserContext';
import { getLngLatFromLocationId } from '../services/LocationService';
import { getListingsWithinDistanceFromAPI } from '../services/ListingService';
import { getRequestsWithinDistanceFromAPI } from '../services/RequestService';

const Places: React.FC = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const { currentUser } = useUserContext();
  const userLocationId = currentUser?.locationId;
  const [userCoordinates, setUserCoordinates] =
    useState<google.maps.LatLngLiteral | null>(null);
  console.log('User Location ID:', userLocationId);
  useEffect(() => {
    const fetchUserCoordinates = async () => {
      if (userLocationId) {
        try {
          const coordinates = await getLngLatFromLocationId(userLocationId);
          setUserCoordinates(coordinates);
          console.log('User Coordinates:', coordinates);
        } catch (error) {
          console.error('Error fetching user coordinates:', error);
        }
      }
    };

    fetchUserCoordinates();
  }, [currentUser]);

  useEffect(() => {
    if (!userCoordinates) {
      console.warn('User coordinates not available yet.');
      return;
    }

    const fetchData = async () => {
      try {
        if (currentUser?.role === 'Guest') {
          // Guests see listings (what hosts are offering)
          const listings = await getListingsWithinDistanceFromAPI(
            userCoordinates,
            80,
          );
          setListings(listings);
        } else if (currentUser?.role === 'Host') {
          // Hosts see requests (what guests are requesting)
          const requests = await getRequestsWithinDistanceFromAPI(
            userCoordinates,
            80,
          );
          setRequests(requests);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userCoordinates, currentUser?.role]);

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setSelectedRequest(null); // Clear request selection
    setShowDetails(true);
  };

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setSelectedListing(null); // Clear listing selection
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-brand-stone-800 mb-6">
          {currentUser?.role === 'Guest'
            ? 'Find Interesting Destinations Near You'
            : 'Find Guest Requests Near You'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg">
            <MapLoader>
              <PlacesMap
                listings={currentUser?.role === 'Guest' ? listings : []}
                requests={currentUser?.role === 'Host' ? requests : []}
                onListingClick={handleListingClick}
                onRequestClick={handleRequestClick}
                selectedListing={selectedListing}
                selectedRequest={selectedRequest}
                userCoordinates={userCoordinates}
              />
            </MapLoader>
          </div>

          <div className="max-h-[calc(100vh-10rem)] overflow-auto">
            <PlaceRecommendations
              listings={currentUser?.role === 'Guest' ? listings : []}
              requests={currentUser?.role === 'Host' ? requests : []}
              onListingClick={handleListingClick}
              onRequestClick={handleRequestClick}
              selectedListing={selectedListing}
              selectedRequest={selectedRequest}
            />
          </div>
        </div>
      </div>

      {showDetails && selectedListing && (
        <PlaceDetails listing={selectedListing} onClose={handleCloseDetails} />
      )}

      {showDetails && selectedRequest && (
        <PlaceDetails request={selectedRequest} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default Places;
