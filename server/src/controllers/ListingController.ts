import { Request, Response, RequestHandler } from 'express';
import Listing from '../models/Listing.js'
import mongoose from 'mongoose';

export const createListing: RequestHandler = async (req: Request, res: Response) => {
  try {

    console.log('creating listing with data:', req.body);

    const listingData = req.body;
    const userId = listingData.userId;

    // validate mongodb object id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const newListing = new Listing(listingData);
    
    await newListing.save();

    res.status(201).json({
      message: 'Listing created successfully',
      listing: newListing,
    });

  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
}