import Review from '../models/Review.js';
import mongoose from 'mongoose';
// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('userId', 'userName firstName lastName avatar')
            .populate('reviewerId', 'userName firstName lastName avatar')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
// Get reviews for a specific user
export const getReviewsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid user ID format' });
            return;
        }
        const reviews = await Review.find({ userId })
            .populate('userId', 'userName firstName lastName avatar')
            .populate('reviewerId', 'userName firstName lastName avatar')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ error: 'Failed to fetch user reviews' });
    }
};
// Get reviews written by a specific reviewer
export const getReviewsByReviewerId = async (req, res) => {
    try {
        const { reviewerId } = req.params;
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(reviewerId)) {
            res.status(400).json({ error: 'Invalid reviewer ID format' });
            return;
        }
        const reviews = await Review.find({ reviewerId })
            .populate('userId', 'userName firstName lastName avatar')
            .populate('reviewerId', 'userName firstName lastName avatar')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error('Error fetching reviewer reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviewer reviews' });
    }
};
// Get a single review by ID
export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid review ID format' });
            return;
        }
        const review = await Review.findById(id)
            .populate('userId', 'userName firstName lastName avatar')
            .populate('reviewerId', 'userName firstName lastName avatar');
        if (!review) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        res.status(200).json(review);
    }
    catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({ error: 'Failed to fetch review' });
    }
};
// Create a new review
export const createReview = async (req, res) => {
    try {
        const { userId, reviewerId, rating, content } = req.body;
        // Validate required fields
        if (!userId || !reviewerId || !rating || !content) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        // Validate rating is between 1-5
        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            res
                .status(400)
                .json({ error: 'Rating must be an integer between 1 and 5' });
            return;
        }
        // Prevent users from reviewing themselves
        if (userId === reviewerId) {
            res.status(400).json({ error: 'Users cannot review themselves' });
            return;
        }
        // Check if review already exists
        const existingReview = await Review.findOne({ userId, reviewerId });
        if (existingReview) {
            res.status(400).json({ error: 'You have already reviewed this user' });
            return;
        }
        const newReview = new Review({
            userId,
            reviewerId,
            rating,
            content,
        });
        await newReview.save();
        // Populate user data before returning
        const populatedReview = await Review.findById(newReview._id)
            .populate('userId', 'userName firstName lastName avatar')
            .populate('reviewerId', 'userName firstName lastName avatar');
        res.status(201).json(populatedReview);
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};
// Update a review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, content } = req.body;
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid review ID format' });
            return;
        }
        // Validate rating is between 1-5 if provided
        if (rating !== undefined &&
            (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
            res
                .status(400)
                .json({ error: 'Rating must be an integer between 1 and 5' });
            return;
        }
        const updatedReview = await Review.findByIdAndUpdate(id, { rating, content }, { new: true, runValidators: true })
            .populate('userId', 'userName firstName lastName avatar')
            .populate('reviewerId', 'userName firstName lastName avatar');
        if (!updatedReview) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        res.status(200).json(updatedReview);
    }
    catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};
// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid review ID format' });
            return;
        }
        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
