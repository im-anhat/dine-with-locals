import { Request, Response, RequestHandler } from 'express';
import Location from '../models/Location.js';

export const createNewLocation = async (req: Request, res: Response) => {
  const { address, city, state, country, zipCode } = req.body;
  try {
    const location = await Location.create({
      address,
      city,
      state,
      country,
      zipCode,
    });
    res.status(200).json({
      locationId: location._id,
      message: 'Location created successfully in location collection',
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
