import { Router } from 'express';
const { loginUser, signupUser } = require('../controllers/userController');

const router = Router();

//Authenticate user
router.post('/login', loginUser);
//Create user in the database
router.post('/signup', signupUser);

//Load the login page
router.get('/login');
//Load the signup page
router.get('/signup');
