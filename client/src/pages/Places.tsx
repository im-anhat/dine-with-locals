import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import MapLoader from '../components/places/MapLoader';
import PlacesMap from '../components/places/PlacesMap';
import PlaceRecommendations from '../components/places/PlaceRecommendations';

// Define mock listings for demonstration
const mockListingsData = [
  {
    id: '1',
    title: 'Authentic Vietnamese Dinner',
    location: { lat: 40.7128, lng: -74.006 },
    hostName: 'Pho Ly quoc su',
  },
  {
    id: '2',
    title: 'Homemade Italian Feast',
    location: { lat: 40.7282, lng: -73.9942 },
    hostName: 'Mario Romano',
  },
  {
    id: '3',
    title: 'Fusion Japanese Experience',
    location: { lat: 40.7589, lng: -73.9851 },
    hostName: 'Kenji Tanaka',
  },
  {
    id: '4',
    title: 'Southern Comfort Food',
    location: { lat: 40.7392, lng: -74.0089 },
    hostName: 'Sarah Johnson',
  },
];

const Places = () => {
  const { currentUser } = useUser();

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [listings, setListings] = useState(mockListingsData);

  const [location, setLocation] = useState({
    lat: 40.7128, // New York City coordinates
    lng: -74.006,
  });

  // Determine if the current user is a host
  const isHost = currentUser?.role === 'Host';

  // When user selects a place on the map
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);

    // Update the location if we have geometry
    if (place.geometry?.location) {
      setLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  // In a real application, you would fetch listings from your API
  // based on the current location
  useEffect(() => {
    // This would be an API call in a real application
    // For now, we'll just use our mock data
    setListings(mockListingsData);
  }, [location]);

  return (
    <div className="flex-1 flex h-screen">
      {/* Map area - takes up 60% width */}
      <div className="flex-grow">
        <MapLoader>
          <PlacesMap onPlaceSelect={handlePlaceSelect} listings={listings} />
        </MapLoader>
      </div>

      {/* Recommendations sidebar - takes up 40% width */}
      <div className="w-2/5 border-l border-brand-stone-200">
        <PlaceRecommendations location={location} isHost={isHost} />
      </div>
    </div>
  );
};

export default Places;
