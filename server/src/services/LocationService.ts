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

// Define interface for Google Maps address component
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface ExtractedAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface LonLat {
  lng: number;
  lat: number;
  address_components?: AddressComponent[];
  extractedAddress?: ExtractedAddress;
}

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL + 'api' ||
  'http://localhost:3000/api';

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

// Utility function to extract specific address components from Google Maps response
export const extractAddressComponents = (
  addressComponents: AddressComponent[],
): ExtractedAddress => {
  const result: ExtractedAddress = {
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  };

  // Find street (can be street_number + route)
  const streetNumber =
    addressComponents.find((component) =>
      component.types.includes('street_number'),
    )?.long_name || '';

  const route =
    addressComponents.find((component) => component.types.includes('route'))
      ?.long_name || '';

  // Try to get street address - use multiple approaches
  if (streetNumber && route) {
    result.street = `${streetNumber} ${route}`;
  } else if (route) {
    result.street = route;
  } else if (streetNumber) {
    result.street = streetNumber;
  } else {
    // Fallback to other address components that might contain street info
    result.street =
      addressComponents.find((component) =>
        component.types.includes('street_address'),
      )?.long_name ||
      addressComponents.find((component) =>
        component.types.includes('thoroughfare'),
      )?.long_name ||
      '';
  }

  // Find city (usually locality or sublocality)
  result.city =
    addressComponents.find((component) => component.types.includes('locality'))
      ?.long_name ||
    addressComponents.find((component) =>
      component.types.includes('sublocality'),
    )?.long_name ||
    addressComponents.find((component) =>
      component.types.includes('postal_town'),
    )?.long_name ||
    addressComponents.find((component) =>
      component.types.includes('administrative_area_level_2'),
    )?.long_name ||
    addressComponents.find((component) =>
      component.types.includes('administrative_area_level_3'),
    )?.long_name ||
    '';

  // Find state (administrative_area_level_1)
  result.state =
    addressComponents.find((component) =>
      component.types.includes('administrative_area_level_1'),
    )?.long_name || '';

  // Find country
  result.country =
    addressComponents.find((component) => component.types.includes('country'))
      ?.long_name || '';

  // Find zipCode (postal_code)
  result.zipCode =
    addressComponents.find((component) =>
      component.types.includes('postal_code'),
    )?.long_name || '';

  return result;
};

// Helper function to geocode an address using a third-party service
export const geocodeLocation = async (
  genCoordinates: LonLat,
): Promise<LonLat> => {
  try {
    // Use Google Maps Geocoding API
    const googleMapsApiKey = 'AIzaSyB_M4VO4zGbdy4eV9a-ZexqVi3kgfFxc_8';
    if (!googleMapsApiKey) {
      throw new Error(
        'Google Maps API key is not defined in environment variables',
      );
    }

    // Convert location to address string if it's a Location object

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${genCoordinates.lat},${genCoordinates.lng}&key=${googleMapsApiKey}`,
    );

    if (
      response.data.status === 'OK' &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      // The Google Maps Geocoding API response includes:
      // - results[0].geometry.location: contains lat and lng properties
      // - results[0].place_id: Google's unique identifier for this place
      // - results[0].address_components: detailed breakdown of address parts

      const result = response.data.results[0];
      const locationCoords = result.geometry.location;
      const addressComponents = result.address_components;

      // Extract specific address components
      const extractedAddress = extractAddressComponents(addressComponents);

      return {
        lat: locationCoords.lat,
        lng: locationCoords.lng,
        address_components: addressComponents,
        extractedAddress: extractedAddress,
      };
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error geocoding location:', error);
    throw new Error('Failed to geocode location');
  }
};
