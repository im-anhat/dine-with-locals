import { Request, Response, RequestHandler } from 'express';
import Location from '../models/Location.js'

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

export const getLocations: RequestHandler = async (req: Request, res: Response) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
}