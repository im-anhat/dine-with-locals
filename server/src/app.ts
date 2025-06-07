import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from './config/socket.js';
import connectDB from './config/mongo.js';
import authRoutes from './routes/AuthRoutes.js';
import locationRoutes from './routes/LocationRoutes.js';
import filterRoutes from './routes/FilterRoutes.js';
import requestRoutes from './routes/RequestRoutes.js';
import listingRoutes from './routes/ListingRoutes.js';
// Import all models first to ensure they're registered with mongoose
import './models/User.js';
import './models/Blog.js';
import './models/Comment.js';
import './models/Like.js';
import './models/Listing.js';
import './models/Location.js';
import './models/Match.js';
import './models/Request.js';
import './models/Notification.js';
import uploadRoutes from './routes/uploadRoutes.js';

import './models/Review.js';

// Import routes after models are registered
import blogRoutes from './routes/BlogRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import MatchRoutes from './routes/MatchRoutes.js';
import reviewRoutes from './routes/ReviewRoutes.js';
import likeRoutes from './routes/LikeRoutes.js';
import commentRoutes from './routes/CommentRoutes.js';
import notificationRoutes from './routes/NotificationRoutes.js';

const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io available throughout the app
app.set('io', io);

// Connect to MongoDB
connectDB();

//Parse user request -> Json format
app.use(express.json());
app.use(express.static('public'));
//Only receive request from some specific routes.
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/filter', filterRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/matches', MatchRoutes); // Added MatchRoutes here as it was only in the duplicate section

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Socket.IO initialized and listening for connections');
});

export default app;
