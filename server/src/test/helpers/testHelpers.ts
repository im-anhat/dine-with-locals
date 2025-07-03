import User from '../../models/User';
import Location from '../../models/Location';
import Blog from '../../models/Blog';
import mongoose from 'mongoose';

export const createTestUser = async (overrides: any = {}) => {
  // Create a test location first
  const testLocation = new Location({
    place_id: `test_place_${Date.now()}_${Math.random()}`,
    name: 'Test Location',
    address: '123 Test Street',
    city: 'Test City', // Required field
    country: 'USA',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
    types: ['establishment'],
  });
  await testLocation.save();

  const defaultUserData = {
    userName: `testuser_${Date.now()}_${Math.random()}`,
    firstName: 'Test',
    lastName: 'User',
    email: `test_${Date.now()}_${Math.random()}@example.com`,
    phone: '+1234567890',
    provider: 'Local' as const,
    password: 'hashedPassword123',
    isVerified: true,
    locationId: testLocation._id,
    role: 'Guest' as const,
    ...overrides,
  };

  const user = new User(defaultUserData);
  await user.save();

  return { user, location: testLocation };
};

export const createTestBlog = async (
  userId: mongoose.Types.ObjectId,
  overrides: any = {},
) => {
  const defaultBlogData = {
    userId,
    blogTitle: `Test Blog ${Date.now()}`,
    blogContent: 'This is a test blog content', // Use blogContent instead of blogBody
    photos: ['test-image.jpg'],
    ...overrides,
  };

  const blog = new Blog(defaultBlogData);
  await blog.save();

  return blog;
};

export const createTestLocation = async (overrides: any = {}) => {
  const defaultLocationData = {
    place_id: `test_place_${Date.now()}_${Math.random()}`,
    name: 'Test Location',
    address: '123 Test Street',
    city: 'Test City', // Required field
    country: 'USA',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
    types: ['establishment'],
    ...overrides,
  };

  const location = new Location(defaultLocationData);
  await location.save();

  return location;
};
