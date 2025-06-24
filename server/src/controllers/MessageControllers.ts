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

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    if (chat.isGroupChat) {
      if (
        !chat.groupAdmin ||
        chat.groupAdmin.toString() !== currentUser._id.toString()
      ) {
        res.status(403).json({
          message: 'Only the host can send messages in this group chat.',
        });
        return;
      }
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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const messages = await Message.find({ chat: req.params.chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'userName firstName lastName avatar')
        .populate('chat');

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);
