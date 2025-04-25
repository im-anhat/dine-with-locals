import UserModel from '../models/User.js';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SALT } from '../seeds/constants.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserLogin } from '../../../shared/types/User.js';
import { User } from '../../../shared/types/User.js';

dotenv.config(); //Load environment variables from .env file

//Create token
/**
 *A client sends username/password combination to the server
 *The server validates the authentication
 *If authentication is successful, the server creates a JWT token else establishes an error response
  On successful authentication, the client gets JWT token in the response body
  Client stores that token in local storage or session storage.
  From next time, the client for making any request supplies the JWT token in request headers like this. Authorization: Bearer <jwt_token>
  Server upon receiving the JWT validates it and sends the successful response else error.
 * 
 */
const createToken = (_id: any) => {
  return jwt.sign({ _id }, process.env.SECRET!, { expiresIn: '3d' }); //If you want to access the key in .env, you need to use dontenv
  // Use `!` to tell TypeScript you're sure it won't be undefined
};

// login a user
const loginUser = async (req: Request, res: Response) => {
  const { userLogin } = req.body;

  try {
    const user = await UserModel.login(userLogin);

    // create a token
    const token = createToken(user._id);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req: Request, res: Response) => {
  const { userSignup } = req.body;

  try {
    const user = await UserModel.signup(userSignup);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
