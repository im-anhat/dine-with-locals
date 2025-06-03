import RequestModel from '../models/Request.js';
import Listing from '../models/Listing.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const fetchRequestDocuments = async (req: Request, res: Response) => {
  const {
    startDate,
    endDate,
    dietaryRestriction,
    locationType,
    numGuests,
    category,
    city,
  } = req.body;

  console.log(req.body);
  // Manually building matching condition for $match state in the aggregation pipeline below
  const matchConditions: Record<string, any> = {};
  //Validation
  if (numGuests) matchConditions.numGuests = numGuests;
  if (locationType) matchConditions.locationType = locationType;
  if (category) matchConditions.category = category;
  if (city) matchConditions['mergedLocation.city'] = city;
  if (dietaryRestriction) {
    matchConditions.dietaryRestriction = { $in: dietaryRestriction };
  } else if (dietaryRestriction) {
    console.error('Error: dietaryRestriction must be an array');
  }
  if (startDate && endDate) {
    matchConditions.$expr = {
      $and: [
        { $gte: ['$time', new Date(startDate)] },
        { $lt: ['$time', new Date(endDate)] },
      ],
    };
  }
  console.log(matchConditions);
  //Create pipeline for aggregation process
  const pipeline: mongoose.PipelineStage[] = [
    //Join location schema with request schema
    {
      $lookup: {
        from: 'locations',
        localField: 'locationId',
        foreignField: '_id',
        as: 'mergedLocation',
      },
    },
    //Join user schema to request schema
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'hostDetails',
      },
    },
    {
      $unwind: '$mergedLocation',
    },
    {
      $unwind: '$hostDetails',
    },
    {
      $match: matchConditions,
    },
  ];

  try {
    const array = await RequestModel.aggregate(pipeline);
    console.log(array);
    res.status(200).json({ dataArray: array });
  } catch (err) {
    console.log(err);
  }
};

export const fetchListingDocuments = async (req: Request, res: Response) => {
  const {
    startDate,
    endDate,
    dietaryRestriction,
    locationType,
    numGuests,
    category,
    city,
  } = req.body;
  const matchConditions: Record<string, any> = {};
  if (locationType) {
    matchConditions.locationType = locationType;
  }
  if (category) {
    matchConditions.category = category;
  }

  if (numGuests) {
    matchConditions.numGuests = numGuests;
  }
  if (city) {
    matchConditions['mergedLocation.city'] = city;
  }
  if (Array.isArray(dietaryRestriction) && dietaryRestriction.length > 0) {
    matchConditions.dietaryRestriction = { $in: dietaryRestriction };
  } else if (dietaryRestriction) {
    console.error('Error: dietaryRestriction must be an array');
  }
  if (startDate && endDate) {
    matchConditions.$expr = {
      $and: [
        { $gte: ['$time', new Date(startDate)] },
        { $lt: ['$time', new Date(endDate)] },
      ],
    };
  }
  console.log(matchConditions);
  const pipeline: mongoose.PipelineStage[] = [
    {
      $lookup: {
        from: 'locations',
        localField: 'locationId',
        foreignField: '_id',
        as: 'mergedLocation',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'guestDetail',
      },
    },
    {
      $unwind: '$mergedLocation',
    },
    {
      $unwind: '$guestDetail',
    },
    {
      $match: matchConditions,
    },
  ];

  // Updated error handling and response structure
  try {
    const array = await Listing.aggregate(pipeline);
    console.log(array);
    res.status(200).json({ success: true, data: array });
  } catch (err) {
    console.error('Error during aggregation:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: errorMessage,
    });
  }
};
