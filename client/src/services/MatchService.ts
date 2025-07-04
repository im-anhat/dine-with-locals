import axios from 'axios';
import { Listing } from '../../../shared/types/Listing';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

export interface Match {
  _id: string;
  hostId: string;
  guestId: string;
  listingId?: string;
  requestId?: string;
  status: 'pending' | 'approved';
  time: Date;
  createdAt: string;
  updatedAt: string;
}

//Get all matches for user by user ID
export const getMatchesByUserId = async (userId: string): Promise<Match[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/matches/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching matches by user ID:', error);
    throw error;
  }
};

// Get all matched listings for a user by their ID
export const getMatchedListingsByUserId = async (
  userId: string,
): Promise<Listing[]> => {
  try {
    const matches = await getMatchesByUserId(userId);

    const listingIds = matches
      .filter((match) => match.listingId)
      .map((match) => match.listingId as string);

    if (listingIds.length === 0) {
      return [];
    }

    // Fetch details of each listing, but filter out invalid IDs first
    const validListingIds = listingIds.filter((id) =>
      /^[0-9a-fA-F]{24}$/.test(id),
    );

    if (validListingIds.length === 0) {
      return [];
    }

    // Use Promise.allSettled to handle individual listing fetch failures
    const listingsPromises = validListingIds.map((id) =>
      axios
        .get(`${API_BASE_URL}/listings/${id}`)
        .then((res) => res.data)
        .catch((err) => {
          console.error(`Failed to fetch listing ${id}:`, err);
          return null; // Return null for failed requests
        }),
    );

    const results = await Promise.all(listingsPromises);

    // Filter out null results (failed requests)
    const listings = results.filter((listing) => listing !== null);
    return listings;
  } catch (error) {
    console.error('Error fetching matched listings by user ID:', error);
    throw error;
  }
};
