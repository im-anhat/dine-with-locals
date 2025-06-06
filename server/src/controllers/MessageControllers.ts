import { Request, Response, RequestHandler } from 'express';
import Message from '../models/Message.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import UserModel from '../models/User.js';
import Chat from '../models/Chat.js';

interface AuthRequest extends Request {
  user?: object | mongoose.Types.ObjectId | any; // Extend Request to include user
}

export const sendMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { chatId, content } = req.body; // Extract chatId and content from request body
    const currentUser = req.user; // Currently logged in user
    console.log(content);

    if (!chatId || !content) {
      console.log('chatId or content not sent with request');
      res.sendStatus(400);
      return;
    }

    let newMessage = {
      senderId: currentUser._id,
      content: content,
      chat: chatId,
      readBy: [currentUser._id], // Initialize with the sender as the first reader
    };

    try {
      let message = await Message.create(newMessage);
      message = await message.populate('senderId', '_id firstName');
      // message = await message.populate({
      //   path: 'chat.users',
      //   select: '-password', // Exclude password from user details
      // });

      // message = await UserModel.populate(message, {
      //   path: 'chat.users',
      //   select: '-password', // Exclude password from user details
      // }); I keep getting a type error with message.

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });

      res.status(200).json(message);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },
);

export const allMessages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate('senderId', 'userName firstName lastName avatar')
        .populate('chat');
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },
);
