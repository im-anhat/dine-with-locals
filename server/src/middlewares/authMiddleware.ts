import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.SECRET || 'default';

interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const authMiddleware = (
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
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decodedToken._id; // Attach the user object to the request
    console.log('Decoded Token:', decodedToken);

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ message: 'Invalid or Expired token' });
    return;
  }
};

export default authMiddleware;
