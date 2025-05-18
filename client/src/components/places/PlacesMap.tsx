import React, { useEffect, useRef, useState } from 'react';

interface PlacesMapProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  listings?: Array<{
    id: string;
    title: string;
    location: { lat: number; lng: number };
    hostName?: string;
  }>;
}

const PlacesMap: React.FC<PlacesMapProps> = ({
  onPlaceSelect,
  listings = [],
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Default to New York City coordinates
    const defaultLocation = { lat: 40.7128, lng: -74.006 };

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          initializeMap(userLocation);
        },
        () => {
          // If user denies location permission, use default location
          initializeMap(defaultLocation);
        },
      );
    } else {
      // Browser doesn't support geolocation
      initializeMap(defaultLocation);
    }

    function initializeMap(center: { lat: number; lng: number }) {
      const newMap = new google.maps.Map(mapRef.current!, {
        center,
        zoom: 13,
        mapTypeControl: false,
      });
      setMap(newMap);

      // Create the search box and link it to the UI element
      const input = document.createElement('input');
      input.placeholder = 'Search for restaurants, cafes...';
      input.className = 'w-full p-3 border rounded shadow-sm';

      const searchBoxDiv = document.createElement('div');
      searchBoxDiv.className =
        'absolute top-4 left-1/2 transform -translate-x-1/2 w-1/2';
      searchBoxDiv.appendChild(input);

      newMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
        searchBoxDiv,
      );

      const newSearchBox = new google.maps.places.SearchBox(input);
      setSearchBox(newSearchBox);

      // Bias the SearchBox results towards current map's viewport
      newMap.addListener('bounds_changed', () => {
        newSearchBox.setBounds(newMap.getBounds() as google.maps.LatLngBounds);
      });

      // Listen for the event fired when the user selects a prediction
      newSearchBox.addListener('places_changed', () => {
        const places = newSearchBox.getPlaces();
        if (!places || places.length === 0) return;

        // For each place, get the icon, name and location
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;

          // Select the first place
          onPlaceSelect(place);

          // Create a marker for the place
          const marker = new google.maps.Marker({
            map: newMap,
            title: place.name,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
          });

          // Create an info window for the marker
          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="p-2">
              <h3 class="font-bold">${place.name}</h3>
              <p>${place.formatted_address}</p>
            </div>`,
          });

          // Show info window when marker is clicked
          marker.addListener('click', () => {
            infoWindow.open({
              anchor: marker,
              map: newMap,
            });
          });

          // Extend the bounds to include the place's location
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });

        // Fit the map to the new bounds
        newMap.fitBounds(bounds);
      });
    }
  }, [onPlaceSelect]);

  // Add markers for listings
  useEffect(() => {
    if (!map) return;

    // Clear any existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add markers for each listing
    listings.forEach((listing) => {
      if (!listing.location) return;

      const marker = new google.maps.Marker({
        position: listing.location,
        map,
        title: listing.title,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
        animation: google.maps.Animation.DROP,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div class="p-2">
          <h3 class="font-bold">${listing.title}</h3>
          ${listing.hostName ? `<p>Host: ${listing.hostName}</p>` : ''}
        </div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open({
          anchor: marker,
          map,
        });
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // If we have listings, adjust the map to show them all
    if (listings.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      listings.forEach((listing) => {
        bounds.extend(listing.location);
      });
      map.fitBounds(bounds);
    }
  }, [map, listings]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default PlacesMap;
