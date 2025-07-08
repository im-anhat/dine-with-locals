import axios from 'axios';
import { BookingFormValues } from '@/components/booking/FormSchema';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/') + 'api';

export const checkExistingBooking = async (
  userId: string,
  listingId: string,
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/matches?userId=${userId}&listingId=${listingId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error checking existing booking:', error);
    throw error;
  }
};

export const getListingById = async (listingId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listing/${listingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};

export const createBookingRequest = async (bookingData: BookingFormValues) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/matches`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error confirming booking:', error);
    throw error;
  }
};
