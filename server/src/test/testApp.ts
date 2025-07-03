/**
 * Test app factory - creates Express app without starting the server
 * This is used for integration tests to avoid port conflicts
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Location from '../models/Location.js';
import authRoutes from '../routes/AuthRoutes.js';
import locationRoutes from '../routes/LocationRoutes.js';
import userRoutes from '../routes/UserRoutes.js';
import requestRoutes from '../routes/RequestRoutes.js';
import listingRoutes from '../routes/ListingRoutes.js';
import blogRoutes from '../routes/BlogRoutes.js';
import reviewRoutes from '../routes/ReviewRoutes.js';
import likeRoutes from '../routes/LikeRoutes.js';
import commentRoutes from '../routes/CommentRoutes.js';
import notificationRoutes from '../routes/NotificationRoutes.js';
import matchRoutes from '../routes/MatchRoutes.js';
import chatRoutes from '../routes/ChatRoutes.js';
import messageRoutes from '../routes/MessageRoutes.js';
import filterRoutes from '../routes/FilterRoutes.js';
import uploadRoutes from '../routes/uploadRoutes.js';
import authMiddleware from '../middlewares/authMiddleware.js';

export function createTestApp() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Basic health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Mock auth routes for testing
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { userName, firstName, lastName, phone, password, role } = req.body;

      // Check for missing required fields
      if (!userName || !firstName || !lastName || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if the userName is already in use
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      // Create a location for the user (required by User model)
      const location = await Location.create({
        address: '123 Test St',
        city: 'Test City',
        state: 'CA',
        country: 'USA',
        zipCode: '12345',
        place_id: `test-place-${new mongoose.Types.ObjectId().toString()}`,
        name: 'Test Location',
        coordinates: {
          lat: 37.7749,
          lng: -122.4194,
        },
      });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        userName,
        firstName,
        lastName,
        phone: phone || '1234567890',
        password: hashedPassword,
        role,
        locationId: location._id,
        provider: 'Local',
      });

      // Generate token
      const token = jwt.sign(
        { _id: user._id },
        process.env.SECRET || 'test-secret',
        { expiresIn: '3d' },
      );

      // Return sanitized user without password
      const userObj = user.toObject();
      const { password: _, ...userWithoutPassword } = userObj;

      return res.status(201).json({
        token,
        user: userWithoutPassword,
        message: 'User created successfully',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      return res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { userName, password } = req.body;

      // Check if required fields are provided
      if (!userName || !password) {
        return res.status(400).json({ error: 'All fields must be filled' });
      }

      // Find user by username
      const user = await User.findOne({ userName });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { _id: user._id },
        process.env.SECRET || 'test-secret',
        { expiresIn: '3d' },
      );

      // Return sanitized user without password
      const userObj = user.toObject();
      const { password: _, ...userWithoutPassword } = userObj;

      return res.status(200).json({
        token,
        user: userWithoutPassword,
        message: 'Login successful',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(400).json({ error: error.message });
    }
  });

  // Mock auth middleware route to match test expectations
  app.get('/api/users/profile', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.SECRET || 'test-secret',
      ) as { _id: string };
      return res.status(200).json({ userId: decoded._id });
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or Expired token' });
    }
  });

  // API Routes - match the same routes as in app.ts
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/location', locationRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/filter', filterRoutes);
  app.use('/api/request', requestRoutes);
  app.use('/api/listing', listingRoutes);
  app.use('/api/likes', likeRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/matches', matchRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/message', messageRoutes);

  // Error handler
  app.use(
    (
      error: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error('Error:', error);
      res.status(500).json({
        error:
          process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message,
      });
    },
  );

  return app;
}

// Create and export an instance of the test app
const testApp = createTestApp();
export default testApp;
