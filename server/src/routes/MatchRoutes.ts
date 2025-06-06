import express from 'express';
import { getMatchesByUserId } from '../controllers/MatchControllers.js';

const router = express.Router();

// GET matches by user ID
router.get('/:userId', getMatchesByUserId);

export default router;
