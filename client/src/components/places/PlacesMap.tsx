import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, Autocomplete } from '@react-google-maps/api';
import { Listing } from '../../data/dummyListings';

interface PlacesMapProps {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
  selectedListing?: Listing | null;
  userCoordinates?: google.maps.LatLngLiteral | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px', // Fixed height for the map
};

const PlacesMap: React.FC<PlacesMapProps> = ({
  listings,
  onListingClick,
  selectedListing,
  userCoordinates,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const center: google.maps.LatLngLiteral = userCoordinates ?? {
    lat: 41.881563,
    lng: -87.649869,
  }; // Default to Chicago if not provided

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(center);
  const [markers, setMarkers] = useState<Array<google.maps.Marker>>([]);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onAutocompleteLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    [],
  );

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current && map) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setMapCenter(newCenter);
        map.setCenter(newCenter);
        map.setZoom(12);
      }
    }
  }, [map]);

  // Create markers when listings or map changes
  useEffect(() => {
    if (!map || !window.google) {
      return;
    }

    // Clean up old markers
    markers.forEach((marker) => {
      marker.setMap(null);
    });

    // Create new markers
    const newMarkers: Array<google.maps.Marker> = [];

    // Create SVG icon for the markers
    const createMarkerIcon = (isSelected: boolean) => {
      const color = isSelected ? '#e53935' : '#0f766e'; // Coral-500 for selected, teal for regular

      // SVG path for a location pin that looks like the image
      const svgMarker = {
        path: 'M12 0C7.58 0 4 3.58 4 8c0 1.4.5 3.3 1.4 4.9.9 1.7 2 3.2 3 4.3.7.8 1.5 1.5 1.9 2 .1.1.2.2.4.3.2.1.2.2.3.3.2.2.6.2.8 0 .1-.1.1-.1.3-.3.1-.1.3-.2.4-.3.4-.4 1.2-1.1 1.9-2 1-1.1 2.1-2.6 3-4.3.9-1.6 1.4-3.5 1.4-4.9 0-4.42-3.58-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 4.5 12 4.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z',
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 1.5,
        anchor: new google.maps.Point(12, 24),
        labelOrigin: new google.maps.Point(12, 8),
      };

      return svgMarker;
    };

    for (const listing of listings) {
      try {
        const isSelected = listing._id === selectedListing?._id;
        const icon = createMarkerIcon(isSelected);

        // Create the marker
        const marker = new google.maps.Marker({
          map,
          position: listing.location,
          title: listing.title,
          icon: icon,
          animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
          zIndex: isSelected ? 100 : 10, // Selected markers show on top
        });

        // Add click event listener
        marker.addListener('click', () => {
          if (onListingClick) {
            onListingClick(listing);
          }
        });

        newMarkers.push(marker);
      } catch (error) {
        console.error('Error creating marker:', error);
      }
    }

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [map, listings, onListingClick, selectedListing]);

  // Center map on selected listing
  useEffect(() => {
    if (map && selectedListing) {
      map.panTo(selectedListing.location);
      map.setZoom(15);
    }
  }, [map, selectedListing]);

  // Add a slight delay to ensure Google Maps API initializes properly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (map && window.google) {
        // Force a re-render of markers
        setMarkers([]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [map, listings]);
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-4 z-10 w-80 md:w-96">
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
          restrictions={{ country: 'us' }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a location..."
              className="w-full p-3 rounded-lg shadow-lg border border-brand-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-coral-500 bg-white text-brand-stone-800"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-coral-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </Autocomplete>
      </div>

      {selectedListing && (
        <div className="absolute bottom-4 left-4 z-10 w-80 md:w-96 bg-white rounded-lg shadow-lg p-4 border-l-4 border-brand-coral-500 animate-in fade-in duration-300">
          <h3 className="font-bold text-lg text-brand-stone-800">
            {selectedListing.title}
          </h3>
          <p className="text-sm text-brand-stone-600 mb-2">
            {selectedListing.hostName} • {selectedListing.cuisine}
          </p>
          <div className="flex items-center">
            <span className="text-brand-coral-500 font-bold">
              ${selectedListing.price}
            </span>
            <span className="mx-2 text-brand-stone-400">•</span>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm text-brand-stone-600">
                {selectedListing.rating}
              </span>
            </div>
          </div>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={12}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: false,
          clickableIcons: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e' }],
            },
          ],
        }}
      />
    </div>
  );
};

export default PlacesMap;
