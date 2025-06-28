import { Request, Response, RequestHandler } from 'express';
import Blog from '../models/Blog.js';
import mongoose from 'mongoose';

// Get all blogs
export const getAllBlogs: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const blogs = await Blog.find()
      .populate('userId', 'userName firstName lastName avatar')
      .populate('listingId')
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// Get blogs for a specific user
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
      .populate('listingId')
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ error: 'Failed to fetch user blogs' });
  }
};

// Create a new blog
export const createBlog: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, blogTitle, blogContent, photos, listingId } = req.body;

    console.log('Creating blog with data:', req.body);

    // Validate required fields
    if (!userId || !blogTitle || !blogContent) {
      res
        .status(400)
        .json({ error: 'UserId, blogTitle, and blogContent are required' });
      return;
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // Validate listingId if provided
    if (listingId && !mongoose.Types.ObjectId.isValid(listingId)) {
      res.status(400).json({ error: 'Invalid listing ID format' });
      return;
    }

    const newBlog = new Blog({
      userId,
      blogTitle,
      blogContent,
      photos: photos || [], // Use provided photos or default to empty array
      listingId: listingId || null, // Add the optional listingId
    });

    await newBlog.save();

    // Populate user data before returning
    const populatedBlog = await Blog.findById(newBlog._id).populate(
      'userId',
      'userName firstName lastName avatar',
    );

    if (!populatedBlog) {
      res.status(500).json({ error: 'Failed to retrieve created blog' });
      return;
    }

    res.status(201).json(populatedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

// Update an existing blog
export const updateBlog: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { blogTitle, blogContent, photos, listingId } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid blog ID format' });
      return;
    }

    // Validate required fields
    if (!blogTitle && !blogContent && !photos && listingId === undefined) {
      res.status(400).json({
        error:
          'At least one of blogTitle, blogContent, photos, or listingId must be provided',
      });
      return;
    }

    // Validate listingId if provided
    if (
      listingId !== undefined &&
      listingId !== null &&
      !mongoose.Types.ObjectId.isValid(listingId)
    ) {
      res.status(400).json({ error: 'Invalid listing ID format' });
      return;
    }

    // Find the blog first to ensure it exists
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    // Update only the fields that are provided
    const updateData: any = {};
    if (blogTitle) updateData.blogTitle = blogTitle;
    if (blogContent) updateData.blogContent = blogContent;
    if (photos) updateData.photos = photos;
    if (listingId !== undefined) updateData.listingId = listingId || null;

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate('userId', 'userName firstName lastName avatar');

    if (!updatedBlog) {
      res.status(404).json({ error: 'Blog not found after update' });
      return;
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

// Delete a blog
export const deleteBlog: RequestHandler = async (
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

    // Find the blog first to ensure it exists
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

// Get a blog by ID
export const getBlogById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid blog ID format' });
    }

    const blog = await Blog.findById(id)
      .populate('userId', 'userName firstName lastName avatar')
      .populate('listingId');

    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};
