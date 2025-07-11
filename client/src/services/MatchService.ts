import axios from 'axios';
import { Listing } from '../../../shared/types/Listing';
import { Match } from '../../../shared/types/Match';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/') + 'api';

//Get all matches for user by user ID
export const getMatchesByUserId = async (userId: string): Promise<Match[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getMatchesListingByUserId/${userId}`,
    );
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
    const response = await axios.get(`${API_BASE_URL}/matches/${userId}`);

    const matches: Match[] = response.data;
    // Extract listings from populated matches
    const listings = matches
      .filter((match) => match.listingId && typeof match.listingId === 'object')
      .map((match) => match.listingId as any) // The listingId is already populated
      .filter((listing) => listing && listing._id);

    return listings;
  } catch (error) {
    console.error('Error fetching matched listings by user ID:', error);
    throw error;
  }
};

//Split function one for Host and one for Guest
export const getMatches = async (
  hostId: string | null,
  guestId: string | null,
  requestId: string | null,
  listingId: string | null,
): Promise<Match[]> => {
  try {
    const matches = await axios.get(
      `${API_BASE_URL}/matches/getMatches?hostId=${hostId}&guestId=${guestId}&requestId=${requestId}&listingId=${listingId}`,
    );
    return matches.data;
  } catch (error) {
    console.error(
      'Error fetching matches by hostId, guestId, requestId and listingId:',
      error,
    );
    throw error;
  }
};

export const approveMatch = async (matchId: string): Promise<Match> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/matches/${matchId}`, {
      status: 'approved',
    });
    return response.data;
  } catch (error) {
    console.error('Error approving match:', error);
    throw error;
  }
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/matches/${matchId}`);
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};
