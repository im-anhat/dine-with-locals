import express from 'express';
import { getUsers, createUser } from '../controllers/ExampleUserControllers.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);

export default router;
