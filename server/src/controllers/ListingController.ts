import { Request, Response } from 'express';
import Listing from '../models/Listing.js';

export const getAllListing = async (req: Request, res: Response) => {
  try {
    const listings = await Listing.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'locationId',
          foreignField: '_id',
          as: 'locationInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $unwind: '$locationInfo',
      },
    ]);
    res.status(200).json(listings);
  } catch (err) {
    console.error('Error fetching all listings: ', err);
    res.status(400).json(err);
  }
};
