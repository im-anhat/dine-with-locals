// server/src/controllers/LikeController.ts
import { Request, Response, RequestHandler } from 'express';
import Like from '../models/Like.js';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Toggle like on a blog post
export const toggleLike: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { blogId, userId } = req.body;

    console.log('🔄 Processing like toggle:', { blogId, userId });

    // Validate MongoDB ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(blogId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      res.status(400).json({ error: 'Invalid blog ID or user ID format' });
      return;
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId).populate(
      'userId',
      'firstName lastName userName',
    );
    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    // Check if user already liked this blog
    const existingLike = await Like.findOne({ userId, blogId });

    const io = req.app.get('io');

    if (existingLike) {
      // Unlike the blog
      await Like.findByIdAndDelete(existingLike._id);

      // Get updated like count
      const likeCount = await Like.countDocuments({ blogId });

      console.log(
        `👎 User ${userId} unliked blog ${blogId}. New count: ${likeCount}`,
      );

      // Emit real-time update to blog room
      io.to(`blog_${blogId}`).emit('like_updated', {
        blogId,
        likeCount,
        isLiked: false,
        userId,
        action: 'unlike',
      });

      // Emit to all users for testing
      io.emit('like_activity', {
        blogId,
        likeCount,
        action: 'unlike',
        userId,
        blogTitle: blog.blogTitle,
      });

      res.status(200).json({
        message: 'Blog unliked successfully',
        likeCount,
        isLiked: false,
      });
    } else {
      // Like the blog
      const newLike = new Like({ userId, blogId });
      await newLike.save();

      // Get updated like count
      const likeCount = await Like.countDocuments({ blogId });

      // Get user who liked the post
      const likerUser = await User.findById(userId).select(
        'firstName lastName userName avatar',
      );

      console.log(
        `👍 User ${userId} liked blog ${blogId}. New count: ${likeCount}`,
      );

      // Emit real-time update to blog room
      io.to(`blog_${blogId}`).emit('like_updated', {
        blogId,
        likeCount,
        isLiked: true,
        userId,
        likerUser,
        action: 'like',
      });

      // Emit to all users for testing
      io.emit('like_activity', {
        blogId,
        likeCount,
        action: 'like',
        userId,
        likerUser,
        blogTitle: blog.blogTitle,
      });

      // Send notification to blog author (if not self-like)
      if (blog.userId._id.toString() !== userId) {
        const notification = {
          type: 'like',
          message: `${likerUser?.firstName} ${likerUser?.lastName} liked your post "${blog.blogTitle}"`,
          blogId,
          blogTitle: blog.blogTitle,
          fromUser: {
            _id: likerUser?._id,
            firstName: likerUser?.firstName,
            lastName: likerUser?.lastName,
            userName: likerUser?.userName,
            avatar: likerUser?.avatar,
          },
          timestamp: new Date(),
        };

        console.log(`🔔 Sending like notification to user ${blog.userId._id}`);

        // Send notification to blog author
        io.to(`user_${blog.userId._id}`).emit('new_notification', notification);

        // Also emit to all for testing
        io.emit('notification_sent', {
          to: blog.userId._id,
          notification,
        });
      }

      res.status(201).json({
        message: 'Blog liked successfully',
        likeCount,
        isLiked: true,
      });
    }
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};
