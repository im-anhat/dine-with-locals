import express from 'express';
import { toggleLike } from '../controllers/LikeController.js';

const router = express.Router();

// Create a like
router.post('/', toggleLike);

// // Unlike
// router.delete('/', unLike);

// // Check if user has liked a blog
// router.get('/check', checkLikeStatus);

// // Get all likes for a blog
// router.get('/blog/:blogId', getLikesByBlogId);

export default router;
