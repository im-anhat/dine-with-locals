import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  accessChat,
  fetchChats,
  getChatInfo,
} from '../controllers/ChatControllers.js';

const router = express.Router();

router.post('/', authMiddleware, accessChat);
router.get('/', authMiddleware, fetchChats);
router.get('/:chatId', authMiddleware, getChatInfo);

export default router;
