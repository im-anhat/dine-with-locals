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
  let page = parseInt((req.query.p as string) || '1');
  let cardPerPage = 10;
  // Manually building matching condition for $match state in the aggregation pipeline below
  const matchConditions: Record<string, any> = {};
  //Validation
  if (numGuests) matchConditions.numGuests = numGuests[0];
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
  //Create pipeline for aggregation process
  const pipeline: mongoose.PipelineStage[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
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
      $unwind: '$userInfo',
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
    {
      //Facet stage allow simultaneous processing of the same data, result in the total number of documents and paginated documents
      //Improve data consistency + reduce database calls
      $facet: {
        metadata: [{ $count: 'totalCount' }],
        data: [{ $skip: (page - 1) * cardPerPage }, { $limit: cardPerPage }],
      },
    },
  ];

  try {
    const array = await RequestModel.aggregate(pipeline);
    console.log(array[0].data.length);
    res.status(200).json(array[0].data);
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
  let page = parseInt((req.query.p as string) || '1');
  let cardPerPage = 10;

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
        as: 'mergedLocation',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'guestDetails',
      },
    },
    {
      $unwind: '$mergedLocation',
    },
    {
      $unwind: '$guestDetails',
    },
    {
      $unwind: '$userInfo',
    },
    {
      $match: matchConditions,
    },
    {
      $facet: {
        metadata: [{ $count: 'totalCount' }],
        data: [{ $skip: (page - 1) * cardPerPage }, { $limit: cardPerPage }],
      },
    },
  ];

  // Updated error handling and response structure
  try {
    const array = await Listing.aggregate(pipeline);
    console.log(array);
    res.status(200).json(array[0].data);
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
