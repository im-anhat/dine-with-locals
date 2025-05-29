import { Router } from 'express';
import {
  fetchRequestDocuments,
  fetchListingDocuments,
} from '../controllers/FilterController.js';

const router = Router();

router.post('/request', fetchRequestDocuments);
router.post('/listing', fetchListingDocuments);

export default router;
