import express from 'express';
import { createLocation } from '../controllers/LocationController.js';

const router = express.Router();

// POST /api/locations - Create a new listing
router.post('/', createLocation);

export default router;