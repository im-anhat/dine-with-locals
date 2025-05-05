import { Request, Response, RequestHandler } from 'express';
import Blog from '../models/Blog.js';
import User from '../models/User.js'; // Import the User model
import mongoose from 'mongoose';

// Get all blogs
export const getAllBlogs: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const blogs = await Blog.find().populate(
      'userId',
      'userName firstName lastName avatar',
    );
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// Get blogs by user ID
export const getBlogsByUserId: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const blogs = await Blog.find({ userId })
      .populate('userId', 'userName firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);

    // Include more details in the response for debugging
    res.status(500).json({
      error: 'Failed to fetch user blogs',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get a single blog by ID
export const getBlogById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid blog ID format' });
      return;
    }

    const blog = await Blog.findById(id).populate(
      'userId',
      'userName firstName lastName avatar',
    );

    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};
