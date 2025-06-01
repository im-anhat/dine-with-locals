// Example usage of the ListingService helper functions
import { 
  getListingsWithinDistance, 
  getListingsWithinDistanceFromAPI,
  calculateDistance, 
  Coordinates 
} from '../services/ListingService.js';
import { dummyListings } from '../data/dummyListings.js';

// Example: Get listings within 80 km of a specific location using dummy data
export const exampleUsageWithDummyData = () => {
  // Example coordinates (Manhattan, New York)
  const userLocation: Coordinates = {
    lat: 40.7589,
    lng: -73.9851
  };

  // Get listings within 80 km (default distance)
  const nearbyListings = getListingsWithinDistance(userLocation, 80, dummyListings);
  
  console.log(`Found ${nearbyListings.length} listings within 80 km:`);
  nearbyListings.forEach((listing, index) => {
    const distance = calculateDistance(userLocation, listing.location);
    console.log(`${index + 1}. ${listing.title} - ${distance.toFixed(2)} km away`);
  });

  // Get listings within a smaller radius (e.g., 10 km)
  const veryNearbyListings = getListingsWithinDistance(userLocation, 10, dummyListings);
  
  console.log(`\nFound ${veryNearbyListings.length} listings within 10 km:`);
  veryNearbyListings.forEach((listing, index) => {
    const distance = calculateDistance(userLocation, listing.location);
    console.log(`${index + 1}. ${listing.title} - ${distance.toFixed(2)} km away`);
  });

  return {
    nearbyListings,
    veryNearbyListings
  };
};

// Example: Get listings within 80 km using API
export const exampleUsageWithAPI = async () => {
  try {
    // Example coordinates (Manhattan, New York)
    const userLocation: Coordinates = {
      lat: 40.7589,
      lng: -73.9851
    };

    // Get listings within 80 km from API
    const nearbyListings = await getListingsWithinDistanceFromAPI(userLocation, 80);
    
    console.log(`Found ${nearbyListings.length} listings within 80 km from API:`);
    nearbyListings.forEach((listing, index) => {
      // Distance is already calculated and included in the API response
      const distance = (listing as any).distance;
      console.log(`${index + 1}. ${listing.title} - ${distance?.toFixed(2)} km away`);
    });

    // Get listings within a smaller radius (e.g., 10 km)
    const veryNearbyListings = await getListingsWithinDistanceFromAPI(userLocation, 10);
    
    console.log(`\nFound ${veryNearbyListings.length} listings within 10 km from API:`);
    veryNearbyListings.forEach((listing, index) => {
      const distance = (listing as any).distance;
      console.log(`${index + 1}. ${listing.title} - ${distance?.toFixed(2)} km away`);
    });

    return {
      nearbyListings,
      veryNearbyListings
    };
  } catch (error) {
    console.error('Error fetching listings from API:', error);
    throw error;
  }
};

// Example: Calculate distance between two specific points
export const calculateDistanceExample = () => {
  const point1: Coordinates = { lat: 40.7589, lng: -73.9851 }; // Manhattan
  const point2: Coordinates = { lat: 40.712776, lng: -74.005974 }; // Lower Manhattan
  
  const distance = calculateDistance(point1, point2);
  console.log(`Distance between points: ${distance.toFixed(2)} km`);
  
  return distance;
};
