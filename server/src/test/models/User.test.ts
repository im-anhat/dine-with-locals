/**
 * User Model Tests
 * Tests for the User model validation, creation, and database operations
 */

import { Types } from 'mongoose';

// Import User model - we'll use require since ES modules can be complex with Jest
const UserModel = require('../../models/User').default;

describe('User Model Tests', () => {
  const validUserData = {
    userName: 'testuser123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890',
    provider: 'Local' as const,
    password: 'hashedpassword123',
    avatar: 'https://example.com/avatar.jpg',
    cover: 'https://example.com/cover.jpg', // Added required field
    socialLink: 'https://twitter.com/testuser',
    role: 'Guest' as const,
    hobbies: ['cooking', 'traveling'],
    cuisines: ['Italian', 'Thai'],
    ethnicity: 'Asian' as const,
    bio: 'Love to cook and explore new cuisines!',
    locationId: new Types.ObjectId(),
  };

  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const user = new UserModel(validUserData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.userName).toBe(validUserData.userName);
      expect(savedUser.firstName).toBe(validUserData.firstName);
      expect(savedUser.lastName).toBe(validUserData.lastName);
      expect(savedUser.provider).toBe(validUserData.provider);
      expect(savedUser.role).toBe(validUserData.role);
      expect(savedUser.hobbies).toEqual(validUserData.hobbies);
      expect(savedUser.cuisines).toEqual(validUserData.cuisines);
    });

    it('should create a Google user without phone requirement', async () => {
      const googleUserData = {
        ...validUserData,
        provider: 'Google' as const,
        phone: undefined,
      };

      const user = new UserModel(googleUserData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.provider).toBe('Google');
      expect(savedUser.phone).toBeUndefined();
    });

    it('should set default values correctly', async () => {
      const minimalData = {
        userName: 'minimal_user',
        firstName: 'Min',
        lastName: 'User',
        phone: '+1234567890',
        password: 'hashedpassword',
        cover: 'https://example.com/cover.jpg', // Added required field
        locationId: new Types.ObjectId(),
      };

      const user = new UserModel(minimalData);
      const savedUser = await user.save();

      expect(savedUser.provider).toBe('Local'); // Default value
      expect(savedUser.role).toBe('Guest'); // Default value
      expect(savedUser.hobbies).toEqual([]); // Default empty array
      expect(savedUser.cuisines).toEqual([]); // Default empty array
    });
  });

  describe('User Validation', () => {
    it('should require userName', async () => {
      const invalidData = { ...validUserData } as any;
      invalidData.userName = undefined;

      const user = new UserModel(invalidData);

      await expect(user.save()).rejects.toThrow(/userName/);
    });

    it('should require firstName', async () => {
      const invalidData = { ...validUserData } as any;
      invalidData.firstName = undefined;

      const user = new UserModel(invalidData);

      await expect(user.save()).rejects.toThrow(/firstName/);
    });

    it('should require phone for Local provider', async () => {
      const invalidData = {
        ...validUserData,
        provider: 'Local' as const,
        phone: undefined,
      };

      const user = new UserModel(invalidData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique userName', async () => {
      // Create first user
      const user1 = new UserModel(validUserData);
      await user1.save();

      // Try to create second user with same userName
      const user2 = new UserModel({
        ...validUserData,
        userName: validUserData.userName, // Same userName
      });

      await expect(user2.save()).rejects.toThrow(/duplicate key/);
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Create test users
      const users = [
        { ...validUserData, userName: 'user1', firstName: 'Alice' },
        { ...validUserData, userName: 'user2', firstName: 'Bob', role: 'Host' },
        {
          ...validUserData,
          userName: 'user3',
          firstName: 'Charlie',
          provider: 'Google',
        },
      ];

      await UserModel.insertMany(users);
    });

    it('should find user by userName', async () => {
      const user = await UserModel.findOne({ userName: 'user1' });

      expect(user).toBeTruthy();
      expect(user?.firstName).toBe('Alice');
    });

    it('should find users by role', async () => {
      const hosts = await UserModel.find({ role: 'Host' });

      expect(hosts).toHaveLength(1);
      expect(hosts[0].firstName).toBe('Bob');
    });

    it('should find users by provider', async () => {
      const googleUsers = await UserModel.find({ provider: 'Google' });

      expect(googleUsers).toHaveLength(1);
      expect(googleUsers[0].firstName).toBe('Charlie');
    });

    it('should count total users', async () => {
      const count = await UserModel.countDocuments();

      expect(count).toBe(3);
    });
  });
});
