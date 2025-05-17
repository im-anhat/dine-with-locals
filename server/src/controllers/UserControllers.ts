// filepath: /Users/nhatle/Documents/vtmp/dine-with-locals/server/src/controllers/UserControllers.ts
import { Request, Response, RequestHandler } from 'express';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { record } from 'zod';

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
    const { userId } = req.params;
    // Validate MongoDB ObjectId format
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
