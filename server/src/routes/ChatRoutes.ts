import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { accessChat, fetchChats } from '../controllers/ChatControllers.js';

const router = express.Router();

router.post('/', authMiddleware, accessChat);
router.get('/', authMiddleware, fetchChats);

export default router;
