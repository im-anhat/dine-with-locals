import axios from 'axios';
import { Request } from '../../../shared/types/Request';

export interface Coordinates {
  lat: number;
  lng: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

/**
 * Get requests within 80 km from given coordinates using API
 * @param userCoordinates User's current coordinates
 * @param maxDistance Maximum distance in kilometers (default: 80)
 * @returns Promise<Request[]> Array of requests within the specified distance
 */
export const getRequestsWithinDistanceFromAPI = async (
  userCoordinates: Coordinates,
  maxDistance: number = 80,
): Promise<Request[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/nearby`, {
      params: {
        lat: userCoordinates.lat,
        lng: userCoordinates.lng,
        distance: maxDistance,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching requests from API:', error);
    throw error;
  }
};

/**
 * Get all requests
 * @returns Promise<Request[]> Array of all requests
 */
export const getAllRequests = async (): Promise<Request[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all requests from API:', error);
    throw error;
  }
};
