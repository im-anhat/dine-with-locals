import express from 'express';
import cors from 'cors';
import connectDB from './config/mongo.js';
import blogRoutes from './routes/BlogRoutes.js';
import './models/User.js';
import userRoutes from './routes/UserRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import locationRoutes from './routes/LocationRoutes.js';

// Import all models first to ensure they're registered with mongoose
import './models/User.js';
import './models/Blog.js';
import './models/Comment.js';
import './models/Like.js';
import './models/Listing.js';
import './models/Location.js';
import './models/Match.js';
import './models/Request.js';
import uploadRoutes from './routes/uploadRoutes.js';

import './models/Review.js';

// Import routes
import reviewRoutes from './routes/ReviewRoutes.js';
import likeRoutes from './routes/LikeRoutes.js';
import commentRoutes from './routes/CommentRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

//Parse user request -> Json format
app.use(express.json());
//Only receive request from some specific routes.
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// Routes

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
