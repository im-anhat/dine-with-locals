import express from 'express';
import {
  createComment,
  getCommentsByBlogId,
} from '../controllers/CommentController.js';
const router = express.Router();

// Create a comment
router.post('/', createComment);

// Get comments by blog ID
router.get('/blog/:blogId', getCommentsByBlogId);

export default router;
