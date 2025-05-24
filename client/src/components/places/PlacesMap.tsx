import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, Autocomplete } from '@react-google-maps/api';
import { Listing } from '../../data/dummyListings';

interface PlacesMapProps {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
  center?: google.maps.LatLngLiteral;
  selectedListing?: Listing | null;
}

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006, // New York City
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const PlacesMap: React.FC<PlacesMapProps> = ({
  listings,
  onListingClick,
  center = defaultCenter,
  selectedListing,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(center);
  const [markers, setMarkers] = useState<
    Array<google.maps.Marker | google.maps.marker.AdvancedMarkerElement>
  >([]);
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
        map.setZoom(14);
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
      if (marker instanceof google.maps.Marker) {
        marker.setMap(null);
      } else if (marker instanceof google.maps.marker.AdvancedMarkerElement) {
        marker.map = null;
      }
    });

    // Create new markers
    const newMarkers: Array<
      google.maps.Marker | google.maps.marker.AdvancedMarkerElement
    > = [];

    // Check if advanced markers are available
    if (
      window.google.maps.marker &&
      window.google.maps.marker.AdvancedMarkerElement
    ) {
      for (const listing of listings) {
        try {
          const { AdvancedMarkerElement, PinElement } = google.maps.marker;

          // Create custom pin element with brand colors
          const pinBackground =
            listing.id === selectedListing?.id
              ? '#f97316' // brand-orange-500 when selected
              : '#0f766e'; // brand-teal-700 for regular state

          const pin = new PinElement({
            background: pinBackground,
            borderColor: '#FFFFFF',
            glyphColor: '#FFFFFF',
            scale: 1.2,
          });

          // Create the marker
          const marker = new AdvancedMarkerElement({
            map,
            position: listing.location,
            title: listing.title,
            content: pin.element,
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
    } else {
      // Fallback to regular markers if advanced markers are not available
      for (const listing of listings) {
        try {
          const marker = new google.maps.Marker({
            map,
            position: listing.location,
            title: listing.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor:
                listing.id === selectedListing?.id ? '#f97316' : '#0f766e',
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 8,
            },
          });

          marker.addListener('click', () => {
            if (onListingClick) {
              onListingClick(listing);
            }
          });

          newMarkers.push(marker);
        } catch (error) {
          console.error('Error creating fallback marker:', error);
        }
      }
    }

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach((marker) => {
        if (marker instanceof google.maps.Marker) {
          marker.setMap(null);
        } else if (marker instanceof google.maps.marker.AdvancedMarkerElement) {
          marker.map = null;
        }
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

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-md z-10 px-4">
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
          restrictions={{ country: 'us' }}
        >
          <input
            type="text"
            placeholder="Search for a location..."
            className="w-full p-3 rounded-lg shadow-md border border-brand-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={12}
        onLoad={onMapLoad}
        options={{
          mapId: 'DEMO_MAP_ID', // Required for advanced markers
          disableDefaultUI: false,
          clickableIcons: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      />
    </div>
  );
};

export default PlacesMap;
