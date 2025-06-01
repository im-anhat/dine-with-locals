import { Request, Response, RequestHandler } from 'express';
import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new comment
export const createComment: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { blogId, userId, content } = req.body;

    console.log('Creating new comment:', {
      blogId,
      userId,
      content: content?.substring(0, 50) + '...',
    });

    // Validate required fields
    if (!blogId || !userId || !content) {
      res
        .status(400)
        .json({ error: 'BlogId, userId, and content are required' });
    }

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

    // Create new comment
    const newComment = new Comment({
      blogId,
      userId,
      content: content.trim(),
    });

    await newComment.save();

    // Populate user data for the response
    const populatedComment = await Comment.findById(newComment._id).populate(
      'userId',
      'firstName lastName userName avatar',
    );

    // Get updated comment count
    const commentCount = await Comment.countDocuments({ blogId });

    console.log(
      `💬 Comment created successfully. Total comments: ${commentCount}`,
    );

    const io = req.app.get('io');

    // Emit real-time update to blog room
    io.to(`blog_${blogId}`).emit('comment_added', {
      blogId,
      comment: populatedComment,
      commentCount,
    });

    // Emit to all users for testing
    io.emit('comment_activity', {
      blogId,
      comment: populatedComment,
      commentCount,
      action: 'added',
      blogTitle: blog.blogTitle,
    });

    // Send notification to blog author (if not self-comment)
    if (blog.userId._id.toString() !== userId) {
      const commenterUser = await User.findById(userId).select(
        'firstName lastName userName avatar',
      );

      const notification = {
        type: 'comment',
        message: `${commenterUser?.firstName} ${commenterUser?.lastName} commented on your post "${blog.blogTitle}"`,
        blogId,
        blogTitle: blog.blogTitle,
        comment: content,
        fromUser: {
          _id: commenterUser?._id,
          firstName: commenterUser?.firstName,
          lastName: commenterUser?.lastName,
          userName: commenterUser?.userName,
          avatar: commenterUser?.avatar,
        },
        timestamp: new Date(),
      };

      console.log(`Sending comment notification to user ${blog.userId._id}`);

      // Send notification to blog author
      io.to(`user_${blog.userId._id}`).emit('new_notification', notification);

      // Also emit to all for testing
      io.emit('notification_sent', {
        to: blog.userId._id,
        notification,
      });
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get comments for a specific blog
export const getBlogComments: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ error: 'Invalid blog ID format' });
      return;
    }

    const comments = await Comment.find({ blogId })
      .populate('userId', 'firstName lastName userName avatar')
      .sort({ createdAt: -1 });

    const commentCount = comments.length;

    // console.log(`📊 Retrieved ${commentCount} comments for blog ${blogId}`);

    res.status(200).json({ comments, commentCount });
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    res.status(500).json({ error: 'Failed to fetch blog comments' });
  }
};
