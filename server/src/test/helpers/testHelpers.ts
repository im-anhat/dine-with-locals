/**
 * Test helper utilities
 * Contains functions to create test data for unit and integration tests
 */

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/User.js';
import Location from '../../models/Location.js';
import Listing from '../../models/Listing.js';
import RequestModel from '../../models/Request.js';

// Generate a valid JWT token for testing
export const generateTestToken = (userId: string): string => {
  return jwt.sign({ _id: userId }, process.env.SECRET || 'test-secret', {
    expiresIn: '1h',
  });
};

// Create a test user
export const createTestUser = async (userData: any = {}) => {
  const password = userData.password || 'TestPassword123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const defaultLocation = await Location.create({
    address: '123 Test St',
    city: 'Test City',
    state: 'CA',
    country: 'USA',
    zipCode: '12345',
    place_id: `test-place-${new mongoose.Types.ObjectId().toString()}`,
    name: 'Test Location',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
  });

  const user = await User.create({
    userName: userData.userName || `testuser-${Date.now()}`,
    firstName: userData.firstName || 'Test',
    lastName: userData.lastName || 'User',
    phone: userData.phone || '1234567890',
    provider: userData.provider || 'Local',
    password: hashedPassword,
    avatar: userData.avatar || 'https://example.com/avatar.jpg',
    cover: userData.cover || 'https://example.com/cover.jpg',
    socialLink: userData.socialLink || 'https://linkedin.com/testuser',
    role: userData.role || 'Guest',
    hobbies: userData.hobbies || ['Reading', 'Cooking'],
    cuisines: userData.cuisines || ['Italian', 'Thai'],
    ethnicity: userData.ethnicity || 'Asian',
    bio: userData.bio || 'This is a test user bio',
    locationId: userData.locationId || defaultLocation._id,
    ...userData,
  });

  const token = generateTestToken(user._id.toString());

  return { user, token, location: defaultLocation };
};

// Create a test listing
export const createTestListing = async (
  userId: mongoose.Types.ObjectId,
  locationId: mongoose.Types.ObjectId,
  listingData: any = {},
) => {
  const listing = await Listing.create({
    userId: userId,
    title: listingData.title || 'Test Listing',
    description:
      listingData.description || 'This is a test listing description',
    images: listingData.images || [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    category: listingData.category || 'dining',
    locationId: locationId,
    additionalInfo: listingData.additionalInfo || 'Additional test info',
    status: listingData.status || 'waiting',
    time: listingData.time || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    duration: listingData.duration || 120, // 2 hours
    interestTopic: listingData.interestTopic || ['Food', 'Culture'],
    numGuests: listingData.numGuests || 4,
    cuisine: listingData.cuisine || ['Italian', 'French'],
    dietary: listingData.dietary || ['Vegetarian', 'Gluten-Free'],
    ...listingData,
  });

  return listing;
};

// Create a test request
export const createTestRequest = async (
  userId: mongoose.Types.ObjectId,
  locationId: mongoose.Types.ObjectId,
  requestData: any = {},
) => {
  const request = await RequestModel.create({
    userId: userId,
    title: requestData.title || 'Test Request',
    locationType: requestData.locationType || 'either',
    locationId: locationId,
    interestTopic: requestData.interestTopic || ['Food', 'Travel'],
    time: requestData.time || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    cuisine: requestData.cuisine || ['Japanese', 'Mexican'],
    dietaryRestriction: requestData.dietaryRestriction || ['Vegan', 'Nut-Free'],
    numGuests: requestData.numGuests || 2,
    additionalInfo:
      requestData.additionalInfo || 'Additional test request info',
    status: requestData.status || 'waiting',
    ...requestData,
  });

  return request;
};

// Create a test location
export const createTestLocation = async (locationData: any = {}) => {
  const location = await Location.create({
    address: locationData.address || '456 Test Ave',
    city: locationData.city || 'Test City',
    state: locationData.state || 'CA',
    country: locationData.country || 'USA',
    zipCode: locationData.zipCode || '12345',
    place_id:
      locationData.place_id ||
      `test-place-${new mongoose.Types.ObjectId().toString()}`,
    name: locationData.name || 'Test Location Name',
    coordinates: locationData.coordinates || {
      lat: 37.7749,
      lng: -122.4194,
    },
    ...locationData,
  });

  return location;
};

// Clean up test data
export const cleanupTestData = async () => {
  await User.deleteMany({});
  await Location.deleteMany({});
  await Listing.deleteMany({});
  await RequestModel.deleteMany({});
};
