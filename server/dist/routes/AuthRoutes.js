import { Router } from 'express';
import { loginUser, signupUser, googleAuthenticate, } from '../controllers/AuthController.js'; // Adjust the import path as necessary
const router = Router();
//authentication routes
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/google', googleAuthenticate);
export default router;
