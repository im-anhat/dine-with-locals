import express from 'express';
import {
  getMatchesByUserId,
  checkUserMatchForListing,
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
// UPDATE match to 'approved' match
router.put('/:matchId', updateMatchRequest);
// DELETE match
router.delete('/:matchId', deleteMatchRequest);
// GET check user match for listing
router.get('/', checkUserMatchForListing);
// POST create a new match
router.post('/', createMatchRequest);

export default router;
