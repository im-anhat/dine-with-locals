import express from 'express';
import { getMatchesByUserId, createMatchRequest, checkUserMatchForListing } from '../controllers/MatchControllers.js';

const router = express.Router();

// GET matches by user ID
router.get('/:userId', getMatchesByUserId);

// GET check user match for listing
router.get('/', checkUserMatchForListing);

// POST create a new match
router.post('/', createMatchRequest);

export default router;
