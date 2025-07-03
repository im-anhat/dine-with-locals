import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { SALT } from '../seeds/constants.js';
import { OAuth2Client } from 'google-auth-library'; //Google's way of verifying token
dotenv.config();
/**
 * Creates a JWT token for the user
 * @param _id - The user's ID
 * @param userName user's username
 * @returns The JWT token as a string
 */
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};
/**
 * To verify a token is valid: ID signed by Google
 * Using the email, email_verified and hd fields, you can determine if Google hosts and is authoritative for an email address
 * client
 */
export const googleAuthenticate = async (req, res) => {
    console.log('Get into google Authentication function');
    //ID token sent from client
    const { credential } = req.body;
    //Google's verification client
    const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);
    //Verifies that token with Google to ensure it's valid
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userName = payload?.email?.replace('@gmail.com', '');
    //Check if user's record already exist on MongoDB
    let existing = await UserModel.findOne({ userName });
    //If not, create a new record in MongoDB for user
    if (!existing) {
        existing = await UserModel.create({
            userName: userName,
            firstName: payload?.given_name,
            lastName: payload?.family_name,
            avatar: payload?.picture,
            role: 'Guest',
            provider: 'Google',
        });
    }
    try {
        // Generate a token with userName and _id
        const token = createToken(existing._id.toString());
        res.status(200).json({ token: token, message: 'Login Successful' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
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
export const loginUser = async (req, res) => {
    const { userName, password } = req.body;
    //Input validation
    if (!userName || !password) {
        throw new Error('All fields must be filled');
    }
    // Check if the userName is already in use
    const returnUser = await UserModel.findOne({ userName });
    // This has error
    if (!returnUser) {
        throw new Error('Username not found');
    }
    // Check if the password is correct
    const match = await bcrypt.compare(password, returnUser.password);
    if (!match) {
        throw Error('Incorrect password');
    }
    try {
        // Generate a token with userName and _id
        const token = createToken(returnUser._id.toString());
        res.status(200).json({ token: token, message: 'Login Successful' });
    }
    catch (error) {
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
export const signupUser = async (req, res) => {
    try {
        const { userName, firstName, lastName, phone, password, role, locationId, avatar, cover, } = req.body;
        // Check if the userName is already in use
        const existing = await UserModel.findOne({ userName });
        if (existing) {
            throw new Error('Username already in use');
        }
        // salt used to hash the password.
        const salt = await bcrypt.genSalt(SALT);
        // hashes the password using the salt.
        const hash = await bcrypt.hash(password, salt);
        const user = await UserModel.create({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            password: hash,
            role: role,
            locationId: locationId,
            avatar: avatar,
            cover: cover,
        });
        // const token = createToken(user._id.toString());
        res.status(200).json({ Message: 'Sign up success' });
    }
    catch (error) {
        //Error during signup: User validation failed: _id: Cast to ObjectId failed for value "" (type string) at path "_id" because of "BSONError"
        console.error('Error during signup:', error.message);
        res.status(400).json({ Error: error.message });
    }
};
