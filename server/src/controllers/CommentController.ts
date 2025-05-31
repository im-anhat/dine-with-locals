import { Request, Response, RequestHandler } from 'express';
import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import mongoose from 'mongoose';

// Create a new comment
export const createComment: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { blogId, userId, content } = req.body;

    // Validate required fields
    if (!blogId || !userId || !content) {
      res
        .status(400)
        .json({ error: 'blogId, userId and content are required' });
    }

    // Validate MongoDB ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(blogId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      res.status(400).json({ error: 'Invalid blogId or userId format' });
    }

    // Create new comment
    const newComment = new Comment({
      blogId,
      userId,
      content,
    });

    await newComment.save();

    // Update comment count in blog
    await Blog.findByIdAndUpdate(blogId, { $inc: { comments: 1 } });

    // Populate user data before returning
    const populatedComment = await Comment.findById(newComment._id).populate(
      'userId',
      'userName firstName lastName avatar',
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get comments for a blog
export const getCommentsByBlogId: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { blogId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ error: 'Invalid blog ID format' });
    }

    // Get comments
    const comments = await Comment.find({ blogId })
      .populate('userId', 'userName firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
