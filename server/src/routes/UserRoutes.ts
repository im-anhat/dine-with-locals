import express from 'express';
import { getAllUsers, getUserById } from '../controllers/UserControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all users
router.get('/', getAllUsers);

// GET user by ID
router.get('/:userId', authMiddleware, getUserById);

export default router;
