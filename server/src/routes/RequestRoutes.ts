import express from 'express';
import { getAllRequest } from '../controllers/RequestController.js';
const router = express.Router();

router.get('/', getAllRequest);
export default router;
