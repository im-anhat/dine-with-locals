import express from 'express';
import { uploadImages } from '../controllers/UploadController.js';

const router = express.Router();

// POST /api/upload/images - Upload multiple images
router.post('/images', uploadImages);

export default router;