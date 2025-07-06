import { User } from '../../../shared/types/User';
import { Listing } from '../../../shared/types/Listing';
import { Request } from '../../../shared/types/Request';
import Chat from '../../../shared/types/Chat';

export const mockUser: User = {
  _id: '64a1b2c3d4e5f6789012345a',
  userName: 'testuser',
  password: 'hashedpassword',
  firstName: 'Test',
  lastName: 'User',
  phone: '+1234567890',
  role: 'Guest',
  avatar: 'https://example.com/avatar.jpg',
  socialLink: 'https://social.com/testuser',
  hobbies: ['cooking', 'travel'],
  cuisines: ['Italian', 'Asian'],
  ethnicity: 'Asian',
  bio: 'Test user bio',
  cover: 'https://example.com/cover.jpg',
  locationId: 'location123',
};

export const mockHost: User = {
  ...mockUser,
  _id: '64a1b2c3d4e5f6789012345b',
  userName: 'testhost',
  firstName: 'Test',
  lastName: 'Host',
  role: 'Host',
};

export const mockLocation = {
  _id: 'location123',
  address: '123 Test St',
  city: 'Test City',
  state: 'Test State',
  country: 'Test Country',
  zipCode: '12345',
  coordinates: {
    lat: 40.7128,
    lng: -74.006,
  },
};

export const mockListing: Listing = {
  _id: '64a1b2c3d4e5f6789012345c',
  userId: {
    userName: mockHost.userName,
    firstName: mockHost.firstName,
    lastName: mockHost.lastName,
    avatar: mockHost.avatar,
  },
  title: 'Test Dining Experience',
  description: 'A wonderful test dining experience',
  images: ['https://example.com/image1.jpg'],
  category: 'dining',
  locationId: mockLocation,
  additionalInfo: 'Italian cuisine with wine pairing',
  status: 'approved',
  time: new Date('2023-12-25T19:00:00.000Z'),
  duration: 120,
  interestTopic: ['pasta', 'wine'],
  numGuests: 4,
};

export const mockRequest: Request = {
  _id: '64a1b2c3d4e5f6789012345d',
  userId: {
    userName: mockUser.userName,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    avatar: mockUser.avatar,
  },
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  title: 'Looking for Italian Food',
  locationType: 'either',
  locationId: mockLocation,
  interestTopic: ['pasta', 'authentic'],
  time: new Date('2023-12-25T19:00:00.000Z'),
  cuisine: ['Italian'],
  dietaryRestriction: [],
  numGuests: 2,
  additionalInfo: 'Would love to try some authentic Italian cuisine',
  status: 'waiting',
};

export const mockChat: Chat = {
  _id: '64a1b2c3d4e5f6789012345e',
  chatName: 'Test Chat',
  isGroupChat: false,
  users: [
    {
      _id: mockUser._id,
      userName: mockUser.userName,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      phone: mockUser.phone,
      avatar: mockUser.avatar || '',
      role: mockUser.role,
    },
    {
      _id: mockHost._id,
      userName: mockHost.userName,
      firstName: mockHost.firstName,
      lastName: mockHost.lastName,
      phone: mockHost.phone,
      avatar: mockHost.avatar || '',
      role: mockHost.role,
    },
  ],
  latestMessage: {
    _id: 'message123',
    content: 'Hello there!',
    senderId: {
      _id: mockUser._id,
      firstName: mockUser.firstName,
    },
    chat: '64a1b2c3d4e5f6789012345e',
    readBy: [],
    createdAt: new Date('2023-12-01T10:00:00.000Z'),
  },
  listing: {
    _id: mockListing._id,
    title: mockListing.title,
    images: mockListing.images || [],
    locationId: {
      _id: mockLocation._id,
      city: mockLocation.city,
      state: mockLocation.state,
      country: mockLocation.country,
    },
    time: mockListing.time?.toISOString() || '2023-12-25T19:00:00.000Z',
  },
  groupAdmin: '',
};

export const mockCoordinates = {
  lat: 40.7128,
  lng: -74.006,
};

export const mockApiResponse = {
  success: true,
  data: null,
  message: 'Success',
};
