import React, { useState } from 'react';

const Places = () => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [location, setLocation] = useState({
    lat: 40.7128,
    lng: -74.006,
  });
  const isHost = currentUser.role === 'Host';
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
  };

  return <div>Places</div>;
};

export default Places;
