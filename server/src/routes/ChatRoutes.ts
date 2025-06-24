import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  accessChat,
  fetchChats,
  getChatInfo,
  createOrUpdateGroupChat,
} from '../controllers/ChatControllers.js';

const router = express.Router();

router.post('/', authMiddleware, accessChat);
router.post('/group', authMiddleware, createOrUpdateGroupChat);
router.get('/', authMiddleware, fetchChats);
router.get('/:chatId', authMiddleware, getChatInfo);

export default router;
