import Listing from '../models/Listing.js';
import RequestModel from '../models/Request.js';
import { Request, Response } from 'express';
import Location from '../models/Location.js';
import mongoose from 'mongoose';
import { IRequest } from '../models/Request.js';

export const fetchDocuments = async (req: Request, res: Response) => {
  console.log(req.body);
  const { date, dietaryRestriction, locationType, numGuests, category, city } =
    req.body;
  console.log(dietaryRestriction);

  //Get the city from Location schema
  try {
    const address = await Location.find({ city: city });
    // const jsObject = JSON.stringify(JSON.parse(address));
    console.log(address);
    //find all locationId with the given city
  } catch (error) {}

  const pipeline: mongoose.PipelineStage[] = [
    //Stage 1: Filter Request documents by dietaryRestriction
    {
      $match: {
        numGuests: numGuests,
        dietaryRestriction: { $in: ['lactose intolerant'] }, // $in operator to match value in array
        locationType: locationType,
        category: category,
        // locationId: { $in: [] },
        // date: new Date(date),
      },
    },
    {
      $lookup: {
        from: 'Location',
        localField: 'locationId',
        foreignField: '_id',
        as: 'location_list',
      },
    },
  ];

  // locationType
  // "either"
  // locationId
  // 682fee085960f358681a8a6d

  // interestTopic
  // Array (3)
  // time
  // 2025-01-31T05:00:00.000+00:00

  // cuisine
  // Array (empty)

  // dietaryRestriction
  // Array (empty)
  // numGuests
  // 2
  // additionalInfo
  // "I want to learn about Chicago's math scene"
  // status
  // "waiting"
  // updatedAt
  // 2025-05-23T15:48:01.635+00:00
  // __v
  // 0
  // category
  // "travel"
  // // 67f7f8281260844f9625ee32-Nhat - locationId: 682fee085960f358681a8a6d
  // // 67f7f8281260844f9625ee33-Quy - locationId: 682fed965960f358681a8a66
  // // 682ff1e72e285c458d216213-Dan - locationId: 682ff1de2e285c458d216210
  // // 682ff10f2e285c458d21620c-Tam - locationId: 682ff0ff2e285c458d216209
  try {
    //   const object: IRequest = {
    //     userId: new mongoose.Types.ObjectId('682ff10f2e285c458d21620c'),
    //     createdAt: new Date(),
    //     title: 'Good local Thai restaurant',
    //     locationType: 'either',
    //     locationId: new mongoose.Types.ObjectId('682ff0ff2e285c458d216209'),
    //     interestTopic: ['Programming', 'Biology', 'Computer Science', 'Career'],
    //     time: new Date('<2025-06-31>'),
    //     cuisine: ['Thai'],
    //     dietaryRestriction: ['lactose intolerant'],
    //     numGuests: 1,
    //     additionalInfo: 'Finding another padthai enthusiast!',
    //     status: 'waiting',
    //   };
    // const insert = await RequestModel.insertOne(object);
    const array = await RequestModel.aggregate(pipeline);
    res.status(200).json({ dataArray: array });
  } catch (err) {
    console.log(err);
  }
};
