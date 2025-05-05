import { IBlog } from '../../../server/src/models/Blog';
import mongoose from 'mongoose';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

// Define a simplified user type that matches what we'll get from the populated response
interface PopulatedUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

// Create a frontend-specific interface that's different from the server model
export interface BlogWithUser {
  _id: string;
  userId: PopulatedUser;
  blogTitle: string;
  blogContent: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

// Fetch all blogs
export const getAllBlogs = async (): Promise<BlogWithUser[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

// Fetch blogs by user ID
export const getBlogsByUserId = async (
  userId: string,
): Promise<BlogWithUser[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user blogs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return [];
  }
};

// Get a single blog by ID
export const getBlogById = async (id: string): Promise<BlogWithUser | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
};
