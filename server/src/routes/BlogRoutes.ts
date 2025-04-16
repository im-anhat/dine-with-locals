import express from 'express';
import {
  getAllBlogs,
  getBlogsByUserId,
  getBlogById,
} from '../controllers/BlogControllers.js';

const router = express.Router();

// GET all blogs
router.get('/', getAllBlogs);

// GET blogs by user ID
router.get('/user/:userId', getBlogsByUserId);

// GET single blog by ID
router.get('/:id', getBlogById);

export default router;
