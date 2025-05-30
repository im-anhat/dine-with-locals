import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { sendMessage, allMessages } from '../controllers/MessageControllers.js';

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/:chatId', authMiddleware, allMessages);

export default router;
