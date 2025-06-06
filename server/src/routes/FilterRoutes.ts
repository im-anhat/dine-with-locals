import express from 'express';
import {
  fetchRequestDocuments,
  fetchListingDocuments,
} from '../controllers/FilterController.js';

const router = express.Router();
router.post('/request', fetchRequestDocuments);
router.post('/listing', fetchListingDocuments);
export default router;
