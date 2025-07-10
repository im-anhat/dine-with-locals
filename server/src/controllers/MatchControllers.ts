import Match from '../models/Match.js';
import RequestModel from '../models/Request.js';
import Listing from '../models/Listing.js';

import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { request } from 'http';

export const getMatches: RequestHandler = async (req, res) => {
  try {
    const { hostId, guestId, listingId, requestId } = req.query;

    const query: any = {};
    if (hostId) {
      if (!mongoose.Types.ObjectId.isValid(String(hostId))) {
        res.status(400).json({ error: 'Invalid HOST ID format' });
      }
      query.hostId = hostId;
    }
    if (guestId) {
      if (!mongoose.Types.ObjectId.isValid(String(guestId))) {
        res.status(400).json({ error: 'Invalid GUEST ID format' });
      }
      query.guestId = guestId;
    }
    if (listingId) {
      if (!mongoose.Types.ObjectId.isValid(String(listingId))) {
        res.status(400).json({ error: 'Invalid LISTING ID format' });
      }
      query.listingId = listingId;
    }
    if (requestId) {
      if (!mongoose.Types.ObjectId.isValid(String(requestId))) {
        res.status(400).json({ error: 'Invalid REQUEST ID format' });
      }
      query.requestId = requestId;
    }

    const matches = await Match.find(query);

    res.status(200).json(matches);
  } catch (err) {
    console.log('ERROR WHILE GETTING MATCHES', err);
    res.status(500).json({ error: 'Failed to fetch match data' });
  }
};

export const getMatchesByUserId: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    //Find a document from Match collection that has 2 conditions
    // (1) hostId = userId or guestId = userId
    // (2) status = 'approved'
    const matches = await Match.find({
      $or: [{ hostId: userId }, { guestId: userId }],
      status: 'approved',
    }).populate([
      {
        path: 'listingId',
        select: '_id title category time',
        populate: {
          path: 'locationId',
          model: 'Location',
          select: 'address city state country',
        },
      },
      {
        path: 'requestId',
        select: '_id title category time',
        populate: {
          path: 'locationId',
          model: 'Location',
          select: 'address city state country',
        },
      },
      {
        path: 'hostId',
        select: 'userName firstName lastName',
      },
      {
        path: 'guestId',
        select: 'userName firstName lastName',
      },
    ]);

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match data' });
  }
};

export const checkUserMatchForListing: RequestHandler = async (req, res) => {
  try {
    const { userId, listingId } = req.query;

    if (!userId || !listingId) {
      res.status(400).json({ error: 'userId and listingId are required' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(listingId as string)) {
      res.status(400).json({ error: 'Invalid listing ID format' });
      return;
    }

    const match = await Match.findOne({
      $or: [{ hostId: userId }, { guestId: userId }],
      listingId: listingId,
      status: { $in: ['pending', 'approved'] },
    });

    res.status(200).json({ hasMatch: !!match, match });
  } catch (error) {
    console.error('Error checking user match for listing:', error);
    res.status(500).json({ error: 'Failed to check match' });
  }
};

export const createMatchRequest: RequestHandler = async (req, res) => {
  console.log(req.body);
  try {
    const {
      hostId,
      guestId,
      requestId,
      listingId,
      additionalDetails,
      hostInfo,
    } = req.body;
    //Verification
    if (!mongoose.Types.ObjectId.isValid(guestId)) {
      res.status(400).json({ error: 'Invalid guest ID format' });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(hostId)) {
      res.status(400).json({ error: 'Invalid host ID format' });
      return;
    }
    //Check if this is Matched with request of listing
    if (requestId != null && !mongoose.Types.ObjectId.isValid(requestId)) {
      res.status(400).json({ error: 'Invalid request ID format' });
      return;
    }
    if (listingId != null && !mongoose.Types.ObjectId.isValid(listingId)) {
      res.status(400).json({ error: 'Invalid listing ID format' });
      return;
    }

    //Check if the match is already created in Match schema
    const existingGuestRequest = await Match.find({
      hostId: hostId,
      guestId: guestId,
      listingId: listingId,
    });

    const existingHostRequest = await Match.find({
      hostId: hostId,
      guestId: guestId,
      requestId: requestId,
    });

    if (existingGuestRequest.length > 0) {
      res.status(400).json('Matching already created');
      return;
    }

    const match = await Match.create({
      hostId: hostId,
      guestId: guestId,
      requestId: requestId,
      listingId: listingId,
      additionalDetails: additionalDetails,
      hostInfo: hostInfo,
      status: 'pending',
    });

    res.status(200).json({ message: 'Match successful', match });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
};

//Accept match
export const updateMatchRequest: RequestHandler = async (req, res) => {
  const { matchId } = req.params;
  //Check if the match is already created in Match schema
  const result = await Match.find({ matchId });

  if (!result) {
    res.status(400).json('Match does not exist');
    return;
  }
  //Validate MongoDB's ObjectID format
  if (!mongoose.Types.ObjectId.isValid(matchId)) {
    res.status(400).json({ err: 'Object ID is not valid' });
    return;
  }
  try {
    const result = await Match.findByIdAndUpdate(
      matchId,
      { status: 'approved' },
      { new: true, runValidators: true },
    )
      .populate('hostId', 'userName firstName lastName avatar')
      .populate('guestId', 'userName firstName lastName avatar');
    if (result) {
      if (result.requestId) {
        //update the Request document's status to approved
        await RequestModel.findOneAndUpdate(
          result.requestId,
          { status: 'approved' },
          { new: true, runValidators: true },
        );
        await result.populate('requestId');
      }
      if (result.listingId) {
        await Listing.findOneAndUpdate(
          result.requestId,
          { status: 'approved' },
          { new: true, runValidators: true },
        );
        await result.populate('listingId');
      }
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ err: 'Error occured', message: err });
  }
};

/**
 * Delete match record and updated status field in Request/Listing table
 * @param req
 * @param res
 * @returns
 */
export const deleteMatchRequest: RequestHandler = async (req, res) => {
  const { matchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(matchId)) {
    res.status(400).json({ err: 'Match ID not valid' });
    return;
  }
  try {
    const match = await Match.findOne({ matchId });
    //Update the match request
    if (match) {
      if (match.requestId) {
        await RequestModel.findOneAndUpdate(
          match.requestId,
          { status: 'waiting' },
          { new: true, runValidators: true },
        );
      }
      if (match.listingId) {
        await Listing.findOneAndUpdate(
          match.requestId,
          { status: 'waiting' },
          { new: true, runValidators: true },
        );
      }
    }
    //Deleted
    const deletedMatch = await Match.findByIdAndDelete(matchId);
    if (!deletedMatch) {
      res.status(400).json({ err: 'Match not found' });
      return;
    }
    res.status(200).json({ message: 'deleted succesfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Delete match failed', err: err });
  }
};

// Get matched listings for a guest by their user ID
export const getMatchedListingsByUserId: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // Find matches where user is a guest (to get listings they can post about)
    const matches = await Match.find({
      guestId: userId,
      status: 'approved',
      listingId: { $exists: true, $ne: null },
    }).populate([
      {
        path: 'listingId',
        select: '_id title category time',
        populate: {
          path: 'locationId',
          model: 'Location',
          select: 'address city state country',
        },
      },
      {
        path: 'hostId',
        select: 'userName firstName lastName',
      },
      {
        path: 'guestId',
        select: 'userName firstName lastName',
      },
    ]);

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match data' });
  }
};
