// filepath: /Users/nhatle/Documents/vtmp/dine-with-locals/server/src/controllers/UserControllers.ts
import { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { record } from 'zod';
import User from '../models/User.js';

// Get all users
export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId  = req.params.userId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

// Update user profile
export const updateUser: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      phone,
      avatar,
      socialLink,
      role,
      hobbies,
      ethnicity,
      bio,
      cover,
    } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Prepare update data - only include fields that were provided
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (socialLink !== undefined) updateData.socialLink = socialLink;
    if (role !== undefined) updateData.role = role;
    if (hobbies !== undefined) updateData.hobbies = hobbies;
    if (ethnicity !== undefined) updateData.ethnicity = ethnicity;
    if (bio !== undefined) updateData.bio = bio;
    if (cover !== undefined) updateData.cover = cover;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password'); // Exclude password field

    if (!updatedUser) {
      res.status(500).json({ error: 'Failed to update user' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user data' });
  }
};
