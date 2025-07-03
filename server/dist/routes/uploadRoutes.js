import express from 'express';
import { uploadImages, uploadSingleImage, } from '../controllers/UploadController.js';
const router = express.Router();
// POST /api/upload/images - Upload multiple images
router.post('/images', uploadImages);
// POST /api/upload/image - Upload single image
router.post('/image', uploadSingleImage);
export default router;
