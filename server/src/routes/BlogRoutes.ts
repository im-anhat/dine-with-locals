import express from 'express';
import {
  getAllBlogs,
  getBlogsByUserId,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
} from '../controllers/BlogController.js';

const router = express.Router();

// GET /api/blogs - Fetch all blogs
router.get('/', getAllBlogs);

// GET /api/blogs/user/:userId - Fetch all blogs by userId
router.get('/user/:userId', getBlogsByUserId);

// GET /api/blogs/:id - Fetch a single blog by ID
router.get('/:id', getBlogById);

// POST /api/blogs - Create a new blog
router.post('/', createBlog);

// PUT /api/blogs/:id - Update a blog
router.put('/:id', updateBlog);

// DELETE /api/blogs/:id - Delete a blog
router.delete('/:id', deleteBlog);

export default router;
