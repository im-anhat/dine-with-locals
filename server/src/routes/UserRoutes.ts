import express from 'express';
import { getAllUsers, getUserById } from '../controllers/UserControllers.js';

const router = express.Router();

// GET all users
router.get('/', getAllUsers);

// GET user by ID
router.get('/:userId', getUserById);

export default router;
