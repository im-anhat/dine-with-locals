import UserModel from '../models/User.js';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserLogin, User } from '../../../shared/types/User.js';

//Load environment variables from .env file
dotenv.config();

/**
 * Creates a JWT token for the user
 * @param _id - The user's ID
 * @returns The JWT token as a string
 */
const createToken = (_id: any): string => {
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  return jwt.sign({ _id }, process.env.SECRET!, { expiresIn: '3d' });
  // Use `!` to tell TypeScript you're sure it won't be undefined
};

/**
 * This function handles user login.
 * It receives the user login data from the request body,
 * attempts to log in the user using the UserModel,
 * and if successful, creates a JWT token for the user.
 * If there's an error, it sends a 400 response with the error message.
 * @param req - The request object containing the user login data
 * @param res - The response object used to send the response
 * @returns A JSON response containing the JWT token or an error message
 */
const loginUser = async (req: Request, res: Response) => {
  const userLogin: UserLogin = req.body;

  try {
    const user = await UserModel.login(userLogin);
    const token = createToken(user._id);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * This function handles user signup.
 * It receives the user signup data from the request body,
 * attempts to create a new user using the UserModel,
 * and if successful, creates a JWT token for the user.
 * If there's an error, it sends a 400 response with the error message.
 * @param req - The request object containing the user signup data
 * @param res - The response object used to send the response
 * @returns A JSON response containing the JWT token or an error message
 */
const signupUser = async (req: Request, res: Response) => {
  const { userSignup } = req.body;

  try {
    const user = await UserModel.signup(userSignup);
    const token = createToken(user._id);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
