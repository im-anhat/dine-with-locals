import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

// Types for payment method
export interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  } | null;
  isDefault: boolean;
  created: number;
}

export interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[];
}

// Add a payment method to user account
export const addPaymentMethod = async (
  userId: string,
  paymentMethodId: string,
): Promise<{
  message: string;
  paymentMethod: PaymentMethod;
}> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/payment-methods`,
      { userId, paymentMethodId },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Failed to add payment method',
    );
  }
};

// Get all payment methods for user
export const getPaymentMethods = async (
  userId: string,
): Promise<PaymentMethodsResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payment/payment-methods/${userId}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Failed to fetch payment methods',
    );
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (
  userId: string,
  paymentMethodId: string,
): Promise<{
  message: string;
  defaultPaymentMethodId: string;
}> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/payment/payment-methods/default`,
      { userId, paymentMethodId },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Failed to set default payment method',
    );
  }
};

// Delete a payment method
export const deletePaymentMethod = async (
  userId: string,
  paymentMethodId: string,
): Promise<{
  message: string;
}> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/payment/payment-methods/${paymentMethodId}`,
      { data: { userId } },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Failed to delete payment method',
    );
  }
};

// Create Stripe customer (if needed)
export const createStripeCustomer = async (
  userId: string,
): Promise<{
  message: string;
  customer: any;
}> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/createCustomer`,
      { userId },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Failed to create Stripe customer',
    );
  }
};

// Create a setup intent for adding payment methods
export const createSetupIntent = async (
  userId: string,
): Promise<{
  client_secret: string;
}> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payment/setup-intent`, {
      userId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Failed to create setup intent',
    );
  }
};

// Create payment intent for booking
export const createBookingPaymentIntent = async (
  userId: string,
  listingId: string,
  matchId: string,
): Promise<{
  message: string;
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  status: string;
}> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/booking-payment-intent`,
      { userId, listingId, matchId },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Failed to create payment intent',
    );
  }
};
