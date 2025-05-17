import { User } from '../../../shared/types/User';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

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