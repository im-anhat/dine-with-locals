import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/UserControllers.js';

const router = express.Router();

// GET all users
router.get('/', getAllUsers);

// GET user by ID
router.get('/:userId', getUserById);

// PUT update user by ID
router.put('/:userId', updateUser);

export default router;
