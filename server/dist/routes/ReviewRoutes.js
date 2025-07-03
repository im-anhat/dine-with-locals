// filepath: /Users/nhatle/Documents/vtmp/dine-with-locals/server/src/routes/ReviewRoutes.ts
import express from 'express';
import { getAllReviews, getReviewsByUserId, getReviewsByReviewerId, getReviewById, createReview, updateReview, deleteReview, } from '../controllers/ReviewControllers.js';
const router = express.Router();
// GET all reviews
router.get('/', getAllReviews);
// GET reviews for a specific user
router.get('/user/:userId', getReviewsByUserId);
// GET reviews written by a specific reviewer
router.get('/reviewer/:reviewerId', getReviewsByReviewerId);
// GET a single review by ID
router.get('/:id', getReviewById);
// POST a new review
router.post('/', createReview);
// PUT (update) an existing review
router.put('/:id', updateReview);
// DELETE a review
router.delete('/:id', deleteReview);
export default router;
