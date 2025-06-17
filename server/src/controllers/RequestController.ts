import { Response, Request } from 'express';
import RequestModel from '../models/Request.js';

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

// Helper function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

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

/**
 * Get nearby requests based on coordinates and distance
 * @route GET /api/requests/nearby
 */
export const getNearbyRequests = async (req: Request, res: Response) => {
  try {
    console.log('getNearbyRequest');
    console.log(req.query);

    const { lat, lng, distance = 80 } = req.query; // distance in kilometers, default 80km

    if (!lat || !lng) {
      res.status(400).json({
        message: 'Latitude and longitude are required',
      });
      return;
    }

    // Get all requests with populated location data (exclude approved/matched requests)
    const requests = await RequestModel.find({ status: { $ne: 'approved' } })
      .populate('userId', 'userName firstName lastName avatar')
      .populate('locationId')
      .exec();
    // Filter requests based on distance calculation
    const nearbyRequests = requests.filter((request) => {
      const location = request.locationId as any;
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

    // Add distance to each request and sort by distance
    const requestsWithDistance = nearbyRequests
      .map((request) => {
        const location = request.locationId as any;
        const calculatedDistance = calculateDistance(
          parseFloat(lat as string),
          parseFloat(lng as string),
          location.coordinates.lat,
          location.coordinates.lng,
        );

        return {
          ...request.toObject(),
          distance: calculatedDistance,
        };
      })
      .sort((a, b) => a.distance - b.distance);
    console.log(requestsWithDistance);

    res.status(200).json(requestsWithDistance);
  } catch (error) {
    console.error('Error finding nearby requests:', error);
    res.status(500).json({
      message: 'Server error while finding nearby requests',
      error: error,
    });
  }
};
