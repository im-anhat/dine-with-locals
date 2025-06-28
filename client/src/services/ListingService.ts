import axios from 'axios';
import { Listing } from '../../../shared/types/Listing';

export interface Coordinates {
  lat: number;
  lng: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 First coordinate (lat, lng)
 * @param coord2 Second coordinate (lat, lng)
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates,
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

/**
 * Convert degrees to radians
 * @param degrees Degrees to convert
 * @returns Radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Get listings within a specified distance from given coordinates
 * Note: This function is commented out because the new Listing interface
 * uses locationId instead of direct coordinates. Use getListingsWithinDistanceFromAPI instead.
 */
/*
export const getListingsWithinDistance = (
  userCoordinates: Coordinates,
  maxDistance: number = 80,
  listings: Listing[]
): Listing[] => {
  const listingsWithDistance = listings
    .map((listing) => {
      const distance = calculateDistance(userCoordinates, listing.location);
      return {
        ...listing,
        distance, // Add distance property for sorting
      };
    })
    .filter((listing) => listing.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)

  // Remove the distance property before returning
  return listingsWithDistance.map(({ distance, ...listing }) => listing);
};
*/

/**
 * Get listings within 80 km from given coordinates using API
 * @param userCoordinates User's current coordinates
 * @param maxDistance Maximum distance in kilometers (default: 80)
 * @returns Promise<Listing[]> Array of listings within the specified distance
 */
export const getListingsWithinDistanceFromAPI = async (
  userCoordinates: Coordinates,
  maxDistance: number = 80,
): Promise<Listing[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listing/nearby`, {
      params: {
        lat: userCoordinates.lat,
        lng: userCoordinates.lng,
        distance: maxDistance,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching listings from API:', error);
    throw error;
  }
};

/**
 * Get all listings
 * @returns Promise<Listing[]> Array of all listings
 */
export const getAllListings = async (): Promise<Listing[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all listings from API:', error);
    throw error;
  }
};

/**
 * Create a new listing
 * @param listingData Data for the new listing
 * @returns Promise<Listing> Created listing
 */
export const createListing = async (
  listingData: Partial<Listing>,
): Promise<Listing> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/listings`, listingData);
    return response.data.listing;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

/**
 * Get a listing by ID
 * @param listingId ID of the listing to fetch
 * @returns Promise<Listing> Listing data
 */
export const getListingById = async (listingId: string): Promise<Listing> => {
  // Validate listingId before making the request
  if (!listingId || typeof listingId !== 'string') {
    throw new Error(`Missing or invalid listing ID: ${listingId}`);
  }

  // Check for valid MongoDB ObjectID format (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(listingId)) {
    throw new Error(
      `Invalid listing ID format: ${listingId}. Expected 24 hexadecimal characters.`,
    );
  }

  try {
    console.log(`Making API request for listing ID: ${listingId}`);
    const response = await axios.get(`${API_BASE_URL}/listing/${listingId}`);
    console.log(`Successfully fetched listing for ID: ${listingId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing by ID ${listingId}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error(`Invalid listing ID format on server: ${listingId}`);
      } else if (error.response?.status === 404) {
        throw new Error(`Listing not found: ${listingId}`);
      }
    }
    throw error;
  }
};

/**
 * Get listings by user ID
 * @param userId ID of the user
 * @returns Promise<Listing[]> Array of user's listings
 */
export const getListingsByUserId = async (
  userId: string,
): Promise<Listing[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching listings by user ID:', error);
    throw error;
  }
};

/**
 * Update a listing
 * @param listingId ID of the listing to update
 * @param listingData Updated listing data
 * @returns Promise<Listing> Updated listing
 */
export const updateListing = async (
  listingId: string,
  listingData: Partial<Listing>,
): Promise<Listing> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/listings/${listingId}`,
      listingData,
    );
    return response.data.listing;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

/**
 * Delete a listing
 * @param listingId ID of the listing to delete
 * @returns Promise<void>
 */
export const deleteListing = async (listingId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/listings/${listingId}`);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};
