import express, { Request, Response } from 'express';
import { createNewLocation } from '../controllers/LocationController.js';

const router = express.Router();

router.post('/createLocation', createNewLocation);

export default router;
