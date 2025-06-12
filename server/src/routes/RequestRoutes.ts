import express from 'express';
import {
  getAllRequest,
  getNearbyRequests,
} from '../controllers/RequestController.js';
const router = express.Router();

// GET all requests
router.get('/', getAllRequest);

// GET nearby requests - must be before /:requestId route to avoid being caught as an ID
router.get('/nearby', getNearbyRequests);

export default router;
