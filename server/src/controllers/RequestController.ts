import { Response, Request } from 'express';
import RequestModel from '../models/Request.js';

export const getAllRequest = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.aggregate([
      {
        $lookup: {
          from: 'users', // The collection to join (User collection)
          localField: 'userId', // The field in the current collection (Request)
          foreignField: '_id', // The field in the joined collection (User)
          as: 'userInfo', // The name of the output array field
        },
      },
      {
        $lookup: {
          from: 'locations', // The collection to join (Location collection)
          localField: 'locationId', // The field in the current collection (Request)
          foreignField: '_id', // The field in the joined collection (Location)
          as: 'locationInfo', // The name of the output array field
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $unwind: '$locationInfo',
      },
    ]);
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(400).json(err);
  }
};
