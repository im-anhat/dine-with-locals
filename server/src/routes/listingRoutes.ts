import express from 'express';
import { createListing } from '../controllers/ListingController.js';

const router = express.Router();

// POST /api/listings - Create a new listing
router.post('/', createListing);

export default router;