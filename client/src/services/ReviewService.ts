import React from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'api' || 'http://localhost:3000/api';

interface PopulatedUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface Review {
  _id: string;
  userId: PopulatedUser; // User being reviewed
  reviewerId: PopulatedUser; // User who wrote the review
  rating: number; // 1-5 stars
  content: string; // Review text
  createdAt: Date;
  updatedAt: Date;
}

export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`);
    console.log(`${API_BASE_URL}/reviews/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}
