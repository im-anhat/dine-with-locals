import express from 'express';
import { createLike, unLike, checkLikeStatus, getLikesByBlogId, } from '../controllers/LikeController.js';
const router = express.Router();
// Create a like
router.post('/', createLike);
// Unlike
router.delete('/', unLike);
// Check if user has liked a blog
router.get('/check', checkLikeStatus);
// Get all likes for a blog
router.get('/blog/:blogId', getLikesByBlogId);
export default router;
