import axios from 'axios';

export interface Location {
  _id: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface LonLat {
  lng: number;
  lat: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

export const getLngLatFromLocationId = async (
  locationId: string,
): Promise<LonLat> => {
  try {
    console.log(
      'request like this: ',
      `${API_BASE_URL}/location/${locationId}`,
    );
    const response = await axios.get(`${API_BASE_URL}/location/${locationId}`);
    if (
      response.data &&
      response.data.coordinates &&
      response.data.coordinates.lat &&
      response.data.coordinates.lng
    ) {
      return {
        lng: response.data.coordinates.lng,
        lat: response.data.coordinates.lat,
      };
    }

    // If coordinates not found or incomplete in the location data
    // Get coordinates by geocoding the address
    const locationData = response.data;
    if (!locationData || !locationData.city) {
      throw new Error('Invalid location data received from API');
    }

    // Geocode the address to get coordinates
    const coordinates = await geocodeLocation(locationData);

    // Update the location record with the coordinates for future use
    try {
      await updateLocationCoordinates(locationId, coordinates);
    } catch (updateError) {
      console.warn('Failed to update location with coordinates:', updateError);
    }

    return coordinates;
  } catch (error) {
    console.error('Error fetching location coordinates:', error);
    throw error;
  }
};

export const createLocation = async (
  locationData: Omit<Location, '_id'>,
): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/location/createLocation`,
      locationData,
    );
    return response.data.locationId;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};

export const updateLocationCoordinates = async (
  locationId: string,
  coordinates: LonLat,
): Promise<void> => {
  try {
    await axios.patch(`${API_BASE_URL}/location/${locationId}`, {
      coordinates,
    });
  } catch (error) {
    console.error('Error updating location coordinates:', error);
    throw error;
  }
};

export const getLocationById = async (
  locationId: string,
): Promise<Location> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/location/${locationId}`);
    return response.data as Location;
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    throw error;
  }
};

// Helper function to geocode an address using a third-party service
export const geocodeLocation = async (
  location: Omit<Location, '_id'>,
): Promise<LonLat> => {
  try {
    // Format the address for geocoding
    const addressString = `${location.address}, ${location.city}, ${location.state || ''}, ${location.country}, ${location.zipCode || ''}`;

    // Use Google Maps Geocoding API
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      throw new Error(
        'Google Maps API key is not defined in environment variables',
      );
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${googleMapsApiKey}`,
    );

    if (
      response.data.status === 'OK' &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const location = response.data.results[0].geometry.location;

      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error geocoding location:', error);
    throw new Error('Failed to geocode location');
  }
};

export const getAllCity = async (): Promise<string[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/location/cities`);
    console.log('CITY', res);
    return res.data;
  } catch (err) {
    console.error('Error fetching all cities', err);
    throw new Error('Failed to geocode location');
  }
};
