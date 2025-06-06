import Match from '../models/Match.js';
import { RequestHandler } from 'express';
import mongoose from 'mongoose';

export const getMatchesByUserId: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const matches = await Match.find({
      $or: [{ hostId: userId }, { guestId: userId }],
      status: 'approved',
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match data' });
  }
};
