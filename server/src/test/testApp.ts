/**
 * Test app - creates Express app instance for testing
 * This is used for integration tests to avoid port conflicts
 */

// @ts-nocheck
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import authRoutes from '../routes/AuthRoutes.js';
import locationRoutes from '../routes/LocationRoutes.js';
import userRoutes from '../routes/UserRoutes.js';
import listingRoutes from '../routes/ListingRoutes.js';
import requestRoutes from '../routes/RequestRoutes.js';
import blogRoutes from '../routes/BlogRoutes.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-production-domain.com']
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/listing', authMiddleware, listingRoutes);
app.use('/api/request', authMiddleware, requestRoutes);

// Test profile endpoint for auth middleware testing
app.get('/api/users/profile', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(400).json({ error: 'User not found' });
  }
  res.status(200).json({ userId: req.user._id });
});

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

export default app;
