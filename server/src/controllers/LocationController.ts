import { Request, Response, RequestHandler } from 'express';
import Location, { ILocation } from '../models/Location.js';
import mongoose from 'mongoose';
import axios from 'axios';

export const createNewLocation: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { address, city, state, country, zipCode } = req.body;
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const addressString = `${address}, ${city}, ${state || ''}, ${country}, ${zipCode || ''}`;
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${googleMapsApiKey}`,
  );

  try {
    const newLocation = await Location.create({
      address,
      city,
      state,
      country,
      zipCode,
      coordinates: {
        lat: response.data.results[0].geometry.location.lat,
        lng: response.data.results[0].geometry.location.lng,
      },
    });
    res.status(200).json({
      locationId: newLocation._id.toString(),
      message: 'Location created successfully in location collection',
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

/**
 * Get location by ID
 * @route GET /api/location/:locationId
 */
export const getLocationById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { locationId } = req.params;
    console.log('Fetching location with ID:', locationId);

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(locationId)) {
      res.status(400).json({ error: 'Invalid location ID format' });
      return;
    }

    const location = await Location.findById(locationId);

    if (!location) {
      res.status(404).json({
        message: 'Location not found',
      });
      return;
    }

    res.status(200).json(location);
  } catch (err) {
    console.error('Error fetching location:', err);
    res.status(500).json({
      message: 'Server error while fetching location',
      error: err,
    });
  }
};

/**
 * Update location coordinates
 * @route PATCH /api/location/:locationId
 */
export const updateLocationCoordinates: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { locationId } = req.params;
    const { coordinates } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(locationId)) {
      res.status(400).json({ error: 'Invalid location ID format' });
      return;
    }

    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      res.status(400).json({
        message: 'Invalid coordinates provided',
      });
      return;
    }

    const location = await Location.findByIdAndUpdate(
      locationId,
      { coordinates },
      { new: true, runValidators: true },
    );

    if (!location) {
      res.status(404).json({
        message: 'Location not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Location coordinates updated successfully',
      location,
    });
  } catch (err) {
    console.error('Error updating location coordinates:', err);
    res.status(500).json({
      message: 'Server error while updating location coordinates',
      error: err,
    });
  }
};

/**
 * Get nearby locations based on coordinates and distance
 * @route GET /api/location/nearby
 */
export const getNearbyLocations: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { lat, lng, distance = 80 } = req.query; // distance in kilometers, default 10km

    if (!lat || !lng) {
      res.status(400).json({
        message: 'Latitude and longitude are required',
      });
      return;
    }

    // Find locations with coordinates within the specified distance
    const locations = await Location.find({
      coordinates: {
        $exists: true,
      },
    }).exec();

    // Calculate distances using the Haversine formula for more accurate earth-distance calculation
    const nearbyLocations = locations.filter((location) => {
      if (!location.coordinates) return false;

      // Haversine formula implementation
      const R = 6371; // Earth's radius in kilometers
      const dLat = toRadians(
        location.coordinates.lat - parseFloat(lat as string),
      );
      const dLon = toRadians(
        location.coordinates.lng - parseFloat(lng as string),
      );

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(parseFloat(lat as string))) *
          Math.cos(toRadians(location.coordinates.lat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const calculatedDistance = R * c; // Distance in kilometers

      const distanceParam =
        typeof distance === 'number'
          ? distance
          : parseFloat(distance as string);
      return calculatedDistance <= distanceParam;
    });

    res.status(200).json(nearbyLocations);
  } catch (err) {
    console.error('Error finding nearby locations:', err);
    res.status(500).json({
      message: 'Server error while finding nearby locations',
      error: err,
    });
  }
};

/**
 * Get all locations
 * @route GET /api/location
 */
export const getAllLocations: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    console.error('Error fetching all locations:', err);
    res.status(500).json({
      message: 'Server error while fetching locations',
      error: err,
    });
  }
};

// Helper function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}


export const createLocation: RequestHandler = async (req: Request, res: Response) => {
  try {
    console.log('creating location with data:', req.body);
    const locationData = req.body;

    const newLocation = new Location(locationData);
    await newLocation.save();

    res.status(201).json({
      message: 'Location created successfully',
      location: newLocation,
    });

  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
}
