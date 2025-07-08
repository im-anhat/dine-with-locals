import express from 'express';
import {
  getMatchesByUserId,
  createMatchRequest,
  updateMatchRequest,
  deleteMatchRequest,
  getMatches,
} from '../controllers/MatchControllers.js';

const router = express.Router();

//GET matches with a combination of criteria: listingId, hostId, guestId
router.get('/getMatches', getMatches);
// GET matches by user ID
router.get('/:userId', getMatchesByUserId);
// POST create new matches
router.post('/createMatch', createMatchRequest);
// UPDATE match to 'approved' match
router.put('/:matchId', updateMatchRequest);
// DELETE match
router.delete('/:matchId', deleteMatchRequest);
export default router;
