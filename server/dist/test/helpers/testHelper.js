import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../../models/User.js';
import LocationModel from '../../models/Location.js';
import ListingModel from '../../models/Listing.js';
import { SALT } from '../../seeds/constants.js';
/**
 * Test helper utilities for backend tests
 */
// Create a test user with hashed password
export const createTestUser = async (overrides = {}) => {
    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash('testPassword123', salt);
    const defaultUser = {
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        password: hashedPassword,
        role: 'Guest',
        avatar: 'https://example.com/avatar.jpg',
        cover: 'https://example.com/cover.jpg',
        provider: 'email',
        ...overrides,
    };
    return await UserModel.create(defaultUser);
};
// Create a test location
export const createTestLocation = async (overrides = {}) => {
    const defaultLocation = {
        name: 'Test City',
        country: 'Test Country',
        state: 'Test State',
        coordinates: {
            latitude: 40.7128,
            longitude: -74.006,
        },
        ...overrides,
    };
    return await LocationModel.create(defaultLocation);
};
// Create a test listing
export const createTestListing = async (userId, locationId, overrides = {}) => {
    const defaultListing = {
        hostId: userId,
        locationId: locationId,
        title: 'Test Listing',
        description: 'A test listing for automated testing',
        price: 25,
        maxGuests: 4,
        cuisineType: 'Italian',
        dietaryRestrictions: ['vegetarian'],
        availableDates: [new Date(Date.now() + 86400000)], // Tomorrow
        images: ['https://example.com/image1.jpg'],
        amenities: ['WiFi', 'Parking'],
        ...overrides,
    };
    return await ListingModel.create(defaultListing);
};
// Generate a JWT token for testing
export const generateTestToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.SECRET || 'test-secret', {
        expiresIn: '1h',
    });
};
// Clean up test data
export const cleanupTestData = async () => {
    await Promise.all([
        UserModel.deleteMany({ userName: { $regex: /^test/ } }),
        LocationModel.deleteMany({ name: { $regex: /^Test/ } }),
        ListingModel.deleteMany({ title: { $regex: /^Test/ } }),
    ]);
};
// Create authenticated request headers
export const createAuthHeaders = (token) => {
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};
// Mock user data for different scenarios
export const mockUsers = {
    validUser: {
        userName: 'testuser1',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        password: 'testPassword123',
        role: 'Guest',
        avatar: 'https://example.com/avatar.jpg',
        cover: 'https://example.com/cover.jpg',
    },
    invalidUser: {
        userName: '', // Invalid: empty username
        firstName: 'Test',
        lastName: 'User',
        password: 'short', // Invalid: too short
    },
    googleUser: {
        userName: 'googleuser',
        firstName: 'Google',
        lastName: 'User',
        role: 'Guest',
        provider: 'Google',
        avatar: 'https://lh3.googleusercontent.com/test',
        cover: 'https://example.com/cover.jpg',
    },
};
// Mock location data
export const mockLocations = {
    validLocation: {
        name: 'Test City',
        country: 'Test Country',
        state: 'Test State',
        coordinates: {
            latitude: 40.7128,
            longitude: -74.006,
        },
    },
    invalidLocation: {
        name: '', // Invalid: empty name
        country: 'Test Country',
    },
};
// Mock listing data
export const mockListings = {
    validListing: {
        title: 'Test Authentic Italian Dinner',
        description: 'Experience authentic Italian cuisine in a cozy setting',
        price: 35,
        maxGuests: 6,
        cuisineType: 'Italian',
        dietaryRestrictions: ['vegetarian', 'gluten-free'],
        availableDates: [
            new Date(Date.now() + 86400000),
            new Date(Date.now() + 172800000),
        ],
        images: [
            'https://example.com/dinner1.jpg',
            'https://example.com/dinner2.jpg',
        ],
        amenities: ['WiFi', 'Parking', 'Pet-friendly'],
    },
    invalidListing: {
        title: '', // Invalid: empty title
        price: -5, // Invalid: negative price
        maxGuests: 0, // Invalid: zero guests
    },
};
