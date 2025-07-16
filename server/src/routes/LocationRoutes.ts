import express from 'express';
import {
  createNewLocation,
  getLocationById,
  updateLocationCoordinates,
  getNearbyLocations,
  getAllLocations,
  getAllCities,
} from '../controllers/LocationController.js';

const router = express.Router();

// Get all cities
router.get('/cities', getAllCities);

// Get all locations
router.get('/', getAllLocations);

// Create a new location
router.post('/createLocation', createNewLocation);

// Get nearby locations - must be before /:locationId route to avoid being caught as an ID
router.get('/nearby', getNearbyLocations);

// Get location by ID
router.get('/:locationId', getLocationById);

// Update location coordinates
router.patch('/:locationId', updateLocationCoordinates);

export default router;
