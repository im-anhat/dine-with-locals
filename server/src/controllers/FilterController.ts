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
  //Validation

  // Manually building matching condition for $match state in the aggregation pipeline below
  const matchConditions: Record<string, any> = {};
  //Validation
  if (numGuests) matchConditions.numGuests = numGuests;
  if (locationType) matchConditions.locationType = locationType;
  if (category) matchConditions.category = category;
  if (city) matchConditions['mergedLocation.city'] = city;
  if (dietaryRestriction && dietaryRestriction.length > 0) {
    matchConditions.dietaryRestriction = { $in: dietaryRestriction };
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
      //Merge locations schema with requestmodels
      $lookup: {
        from: 'locations',
        localField: 'locationId',
        foreignField: '_id',
        as: 'mergedLocation',
      },
    },
    {
      $unwind: '$mergedLocation',
    },
    {
      //Match conditions specified above
      $match: matchConditions,
    },
  ];
  /**
   * ========================================================================
    USER DATA FOR INPUT TO MONGODB
    - 67f7f8281260844f9625ee32-Nhat - locationId: 682fee085960f358681a8a6d
    - 67f7f8281260844f9625ee33-Quy - locationId: 682fed965960f358681a8a66
    - 682ff1e72e285c458d216213-Dan - locationId: 682ff1de2e285c458d216210
    - 682ff10f2e285c458d21620c-Tam - locationId: 682ff0ff2e285c458d216209
   * ========================================================================
   */

  try {
    /**
     *================== CODE TO ADD NEW REQUEST TO MONGODB ======================
     * const object: IRequest = {
        userId: new mongoose.Types.ObjectId('682ff10f2e285c458d21620c'),
        createdAt: new Date(),
        title: 'Good local Thai restaurant',
        locationType: 'either',
        locationId: new mongoose.Types.ObjectId('682ff0ff2e285c458d216209'),
        interestTopic: ['Programming', 'Biology', 'Computer Science', 'Career'],
        time: new Date('<2025-06å-31>'),
        cuisine: ['Thai'],
        dietaryRestriction: ['lactose intolerant'],
        numGuests: 1,
        additionalInfo: 'Finding another padthai enthusiast!',
        status: 'waiting',
      };
     * const insert = await RequestModel.insertOne(object);
     */

    const array = await RequestModel.aggregate(pipeline);
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
  if (dietaryRestriction && dietaryRestriction.length > 0) {
    matchConditions.dietaryRestriction = { $in: dietaryRestriction };
  }
  if (startDate && endDate) {
    matchConditions.$expr = {
      $and: [
        { $gte: ['$time', new Date(startDate)] },
        { $lt: ['$time', new Date(endDate)] },
      ],
    };
  }
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
      $unwind: '$mergedLocation',
    },
    {
      $match: matchConditions,
    },
  ];

  try {
    const array = await Listing.aggregate(pipeline);
    res.status(200).json({ dataArray: array });
  } catch (err) {
    console.log(err);
  }
};
