import { Request, Response, RequestHandler } from 'express';
import Like from '../models/Like.js';
import Blog from '../models/Blog.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new like
export const createLike: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, blogId } = req.body;

    // Validate required fields
    if (!userId || !blogId) {
      res.status(400).json({ error: 'userId and blogId are required' });
      return;
    }

    // Validate MongoDB ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(blogId)
    ) {
      res.status(400).json({ error: 'Invalid userId or blogId format' });
      return;
    }

    // Check if like already exists
    const existingLike = await Like.findOne({ userId, blogId });
    if (existingLike) {
      res.status(400).json({ error: 'User has already liked this blog' });
      return;
    }

    // Get the blog and its author
    const blog = await Blog.findById(blogId).populate('userId', 'userName firstName lastName');
    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    // Get the liker information
    const liker = await User.findById(userId).select('userName firstName lastName');
    if (!liker) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Create new like
    const newLike = new Like({ userId, blogId });
    await newLike.save();

    // Update like count in blog
    await Blog.findByIdAndUpdate(blogId, { $inc: { likes: 1 } });

    // Create notification for blog author (only if liker is not the author)
    if (blog.userId._id.toString() !== userId.toString()) {
      const notification = new Notification({
        recipientId: blog.userId._id,
        senderId: userId,
        type: 'like',
        message: `${liker.userName || liker.firstName} liked your blog: "${blog.blogTitle}"`,
        blogId: blogId,
        blogTitle: blog.blogTitle,
      });

      await notification.save();

      // Emit real-time notification via Socket.IO
      const io = req.app.get('io');
      if (io) {
        const populatedNotification = await Notification.findById(notification._id)
          .populate('senderId', 'userName firstName lastName avatar')
          .populate('blogId', 'blogTitle');

        if (populatedNotification) {
          io.to(`user_${blog.userId._id}`).emit('new_notification', {
            _id: populatedNotification._id,
            type: 'like',
            message: populatedNotification.message,
            senderId: populatedNotification.senderId,
            blogId: populatedNotification.blogId,
            blogTitle: populatedNotification.blogTitle,
            isRead: false,
            createdAt: populatedNotification.createdAt,
          });
        }
      }
    }

    res.status(201).json(newLike);
  } catch (error) {
    console.error('Error creating like:', error);
    res.status(500).json({ error: 'Failed to create like' });
  }
};

// Unlike
export const unLike: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { userId, blogId } = req.body;

    // Validate required fields
    if (!userId || !blogId) {
      res.status(400).json({ error: 'userId and blogId are required' });
    }

    // Delete the like
    const deletedLike = await Like.findOneAndDelete({ userId, blogId });

    if (!deletedLike) {
      res.status(404).json({ error: 'Like not found' });
    }

    // Update like count in blog
    await Blog.findByIdAndUpdate(blogId, { $inc: { likes: -1 } });

    res.status(200).json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error deleting like:', error);
    res.status(500).json({ error: 'Failed to delete like' });
  }
};

// Check if a user has liked a blog
export const checkLikeStatus: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, blogId } = req.query;

    // Validate required fields
    if (!userId || !blogId) {
      res.status(400).json({ error: 'userId and blogId are required' });
      return;
    }

    // Check if like exists
    const like = await Like.findOne({
      userId: userId.toString(),
      blogId: blogId.toString(),
    });

    res.status(200).json({ isLiked: !!like });
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({ error: 'Failed to check like status' });
  }
};

// Get all likes for a blog
export const getLikesByBlogId: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { blogId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ error: 'Invalid blogId format' });
    }

    // Get likes
    const likes = await Like.find({ blogId }).populate(
      'userId',
      'userName firstName lastName avatar',
    );

    res.status(200).json(likes);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
};
