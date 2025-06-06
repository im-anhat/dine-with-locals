import express from 'express';
import {
  getAllListing,
  getListingById,
  createListing,
  getNearbyListings,
  updateListing,
  deleteListing,
  getListingsByUserId,
} from '../controllers/ListingController.js';

const router = express.Router();

// GET all listings
router.get('/', getAllListing);

// GET nearby listings - must be before /:listingId route to avoid being caught as an ID
router.get('/nearby', getNearbyListings);

// GET listings by user ID
router.get('/user/:userId', getListingsByUserId);

// GET listing by ID
router.get('/:listingId', getListingById);

// POST create a new listing
router.post('/', createListing);

// PUT update a listing
router.put('/:listingId', updateListing);

// DELETE a listing
router.delete('/:listingId', deleteListing);

export default router;
