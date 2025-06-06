import { Request, Response, RequestHandler } from 'express';
import Chat from '../models/Chat.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import UserModel from '../models/User.js';

interface AuthRequest extends Request {
  user?: object | mongoose.Types.ObjectId | any; // Extend Request to include user
}

export const accessChat = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req.body; // id of the user to chat with
    const currentUser = req.user; // currently logged in user
    if (!userId) {
      console.log('userId not sent with request');
      res.sendStatus(400);
      return;
    }

    // check if chat already exists between the two users
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUser._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    }).populate([
      {
        path: 'users',
        select: '_id userName firstName lastName phone avatar role',
      },
      {
        path: 'latestMessage',
        populate: {
          path: 'senderId',
          model: 'User',
          select: '_id firstName',
        },
      },
    ]);

    console.log('isChat:', isChat);

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      // if chat does not exist, create a new chat
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [currentUser._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate([
          { path: 'users', select: '-password' },
        ]);
        res.status(200).json(FullChat);
      } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }
  },
);

export const fetchChats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const currentUser = req.user; // currently logged in user
    try {
      let chats = await Chat.find({
        users: { $elemMatch: { $eq: currentUser._id } },
      })
        .populate([
          {
            path: 'users',
            select: '_id userName firstName lastName phone avatar role',
          },
          {
            path: 'latestMessage',
            populate: {
              path: 'senderId',
              model: 'User',
              select: '_id userName firstName lastName phone avatar role',
            },
          },
        ])
        .sort({ updatedAt: -1 });

      // console.log('Fetched chats:', chats);
      res.status(200).json(chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },
);
