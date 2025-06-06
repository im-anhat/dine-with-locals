import { Request, Response, RequestHandler } from 'express';
import Listing from '../models/Listing.js';
import Location from '../models/Location.js';
import mongoose from 'mongoose';

export const createListing: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log('creating listing with data:', req.body);

    const listingData = req.body;
    const userId = listingData.userId;

    // validate mongodb object id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // save location if it doesn't exist in mongodb first
    const locationData = listingData.location;
    const newLocation = new Location(locationData);
    const existingLocation = await Location.findOne({
      place_id: locationData.place_id,
    });
    if (existingLocation) {
      console.log('Location already exists:', existingLocation);
      listingData.locationId = existingLocation._id;
    } else {
      console.log('Creating new location:', newLocation);
      await newLocation.save();
    }

    // remove location object and replace with locationId
    if (listingData.location) {
      delete listingData.location;
    }
    if (!listingData.locationId) {
      listingData.locationId = newLocation._id;
    }

    console.log('Listing data after location check:', listingData);

    // save listing
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
};
