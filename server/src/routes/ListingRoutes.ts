const router = express.Router();

import { getAllListing } from '../controllers/ListingController.js';
import express from 'express';

router.get('/', getAllListing);
export default router;
