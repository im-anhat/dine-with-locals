import { User } from '../../../shared/types/User';

const API_URL = process.env.API_BASE_URL + 'api' || 'http://localhost:3000/api';

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  // This would normally fetch the current user based on authentication
  // For now, we'll just use a placeholder or fetch from a specific endpoint
  try {
    const response = await fetch(`${API_URL}/users/me`);

    if (!response.ok) {
      throw new Error(`Failed to fetch current user data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};
