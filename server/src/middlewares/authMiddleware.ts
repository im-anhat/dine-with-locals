import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.SECRET || 'default';

interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const authMiddleware = async (
  req: Request | AuthRequest | any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Token missing' });
      return;
    }

    // verify token and attach currently logged in user data to request
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decodedToken._id;
    req.user = await User.findById(userId).select('-password'); // Exclude password field
    req.userToken = token;

    // for debug
    // console.log('Decoded Token:', decodedToken);
    // console.log(req.user);

    // pass to next router
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ message: 'Invalid or Expired token' });
    return;
  }
};

export default authMiddleware;
