import { Router } from 'express';
import { fetchDocuments } from '../controllers/FilterController.js';

const router = Router();

router.post('/', fetchDocuments);

export default router;
