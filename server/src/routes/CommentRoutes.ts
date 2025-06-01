import express from 'express';
import {
  createComment,
  getBlogComments,
} from '../controllers/CommentController.js';
const router = express.Router();

// Create a comment
router.post('/', createComment);

// Get comments by blog ID
router.get('/blog/:blogId', getBlogComments);

export default router;
