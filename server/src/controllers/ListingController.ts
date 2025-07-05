import { Request, Response, RequestHandler } from 'express';
import Listing, { IListing } from '../models/Listing.js';
import Location from '../models/Location.js';
import mongoose from 'mongoose';
import Match from '../models/Match.js';

/**
 * Get listing by ID
 * @route GET /api/listings/:listingId
 */
export const getListingById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { listingId } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      res.status(400).json({ error: 'Invalid listing ID format' });
      return;
    }

    const listing = await Listing.findById(listingId)
      .populate('userId', 'userName firstName lastName avatar')
      .populate('locationId');

    if (!listing) {
      res.status(404).json({
        message: 'Listing not found',
      });
      return;
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({
      message: 'Server error while fetching listing',
      error: error,
    });
  }
};

/**
 * Create a new listing
 * @route POST /api/listings
 */

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

/**
 * Get nearby listings based on coordinates and distance
 * @route GET /api/listings/nearby
 */
export const getNearbyListings: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { lat, lng, distance = 80 } = req.query; // distance in kilometers, default 80km

    if (!lat || !lng) {
      res.status(400).json({
        message: 'Latitude and longitude are required',
      });
      return;
    }

    // Get all listings with populated location data (exclude approved/matched listings)
    const listings = await Listing.find({ status: { $ne: 'approved' } })
      .populate('userId', '_id userName firstName lastName avatar')
      .populate('locationId')
      .exec();

    // Filter listings based on distance calculation
    const nearbyListings = listings.filter((listing) => {
      const location = listing.locationId as any;
      if (!location || !location.coordinates) return false;

      // Calculate distance using Haversine formula
      const calculatedDistance = calculateDistance(
        parseFloat(lat as string),
        parseFloat(lng as string),
        location.coordinates.lat,
        location.coordinates.lng,
      );

      const distanceParam =
        typeof distance === 'number'
          ? distance
          : parseFloat(distance as string);
      return calculatedDistance <= distanceParam;
    });

    // Add distance to each listing and sort by distance
    const listingsWithDistance = nearbyListings
      .map((listing) => {
        const location = listing.locationId as any;
        const calculatedDistance = calculateDistance(
          parseFloat(lat as string),
          parseFloat(lng as string),
          location.coordinates.lat,
          location.coordinates.lng,
        );

        return {
          ...listing.toObject(),
          distance: calculatedDistance,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(listingsWithDistance);
  } catch (error) {
    console.error('Error finding nearby listings:', error);
    res.status(500).json({
      message: 'Server error while finding nearby listings',
      error: error,
    });
  }
};

/**
 * Update a listing
 * @route PUT /api/listings/:listingId
 */
export const updateListing: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { listingId } = req.params;
    const updateData = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      res.status(400).json({ error: 'Invalid listing ID format' });
      return;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updateData,
      { new: true, runValidators: true },
    )
      .populate('userId', 'userName firstName lastName avatar')
      .populate('locationId');

    if (!updatedListing) {
      res.status(404).json({
        message: 'Listing not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Listing updated successfully',
      listing: updatedListing,
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      message: 'Server error while updating listing',
      error: error,
    });
  }
};

/**
 * Delete a listing
 * @route DELETE /api/listings/:listingId
 */
export const deleteListing: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { listingId } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      res.status(400).json({ error: 'Invalid listing ID format' });
      return;
    }

    const deletedListing = await Listing.findByIdAndDelete(listingId);

    if (!deletedListing) {
      res.status(404).json({
        message: 'Listing not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      message: 'Server error while deleting listing',
      error: error,
    });
  }
};

/**
 * Get listings by user ID
 * @route GET /api/listings/user/:userId
 */
export const getListingsByUserId: RequestHandler = async (
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

    const listings = await Listing.find({ userId })
      .populate('userId', 'userName firstName lastName avatar')
      .populate('locationId')
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({
      message: 'Server error while fetching user listings',
      error: error,
    });
  }
};

// Helper function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Helper function to calculate distance using Haversine formula
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// start of incoming
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

/**
 * Fetch matchs from list
 * @route GET /api/listing/match/:listingId
 */
export const getMatchesFromListingID = async (req: Request, res: Response) => {
  try {
    const { listingID } = req.params;
    const matches = await Match.find({ listingId: listingID });
    res.status(200).json(matches);
  } catch (err) {
    console.error('Error', err);
    res.status(400).json(err);
  }
};
