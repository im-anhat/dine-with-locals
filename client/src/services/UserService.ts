import { User, AuthenticatedUser } from '../../../shared/types/User';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

export const getUserById = async (userId: string): Promise<User> => {
  try {
    console.log(`${API_BASE_URL}/users/${userId}`);
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

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  socialLink?: string;
  hobbies?: string[];
  cuisines?: string[];
  ethnicity?: 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
  bio?: string;
  cover?: string;
}

export const updateUserProfile = async (
  userId: string,
  userData: UpdateUserData,
): Promise<AuthenticatedUser> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user profile: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
