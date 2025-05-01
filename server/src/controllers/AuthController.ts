import UserModel from '../models/User.js';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserLogin, User } from '../../../shared/types/User.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { SALT } from '../seeds/constants.js';

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

// async function login(
//   this: UserModel,
//   user: UserLogin,
// ): Promise<User & Document> {
//   // Destructure the user object to get the required fields
//   const { userName, password } = user;

//   return returnUser;
// }
// // 2. Add static methods to the schema
// UserSchema.static('signup', signup);
// UserSchema.static('login', login);

// // 3. Create a Model.
// const UserModel = model<User, UserModel>('User', UserSchema);
// export default UserModel;

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
export const loginUser = async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  //Input validation
  if (!userName || !password) {
    throw new Error('All fields must be filled');
  }

  // Check if the userName is already in use
  const returnUser = await UserModel.findOne({
    userName,
  });
  if (!returnUser) {
    throw new Error('Username not found');
  }
  // Check if the password is correct
  const match = await bcrypt.compare(password, returnUser.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  try {
    const user = await UserModel.login(req.body);
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
export const signupUser = async (req: Request, res: Response) => {
  try {
    // const user = await UserModel.signup(req.body);
    const {
      userName,
      firstName,
      lastName,
      phone,
      password,
      avatar,
      socialLink,
      role,
      hobbies,
    } = req.body;
    console.log(userName);
    console.log(password);
    console.log(!userName || !password);

    if (!userName || !password) {
      throw new Error('Username and password must be filled');
    }
    if (!validator.isMobilePhone(phone, 'any')) {
      throw new Error('Phone not valid');
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error('Password not strong enough');
    }
    if (socialLink && !validator.isURL(socialLink)) {
      throw new Error('Social link not valid');
    }

    // Check if the userName is already in use
    const existing = await UserModel.findOne({ userName });
    if (existing) {
      throw new Error('Username already in use');
    }

    // salt used to hash the password.
    const salt = await bcrypt.genSalt(SALT);
    // hashes the password using the salt.
    const hash = await bcrypt.hash(password, salt);

    //
    const user = await UserModel.create({
      userName,
      firstName,
      lastName,
      phone,
      password: hash,
      avatar,
      socialLink,
      role,
      hobbies,
    });
    const token = createToken(user._id);

    res.status(200).json({ token });
  } catch (error: any) {
    //Error during signup: User validation failed: _id: Cast to ObjectId failed for value "" (type string) at path "_id" because of "BSONError"
    console.error('Error during signup:', error.message);
    res.status(400).json({ error: error.message });
  }
};
