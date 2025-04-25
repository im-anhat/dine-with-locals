import express from 'express';
import {
  getAllBlogs,
  getBlogsByUserId,
  createBlog,
} from '../controllers/BlogController.js';

const router = express.Router();

// GET /api/blogs - Fetch all blogs
router.get('/', getAllBlogs);

// GET /api/blogs/user/:userId - Fetch all blogs by userId
router.get('/user/:userId', getBlogsByUserId);

// POST /api/blogs - Create a new blog
router.post('/', createBlog);

export default router;
