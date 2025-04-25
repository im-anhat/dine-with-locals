import express from 'express';
import cors from 'cors';
import connectDB from './config/mongo.js';

// Import all models first to ensure they're registered with mongoose
import './models/User.js';
import './models/Blog.js';
import './models/Comment.js';
import './models/Like.js';
import './models/Listing.js';
import './models/Location.js';
import './models/Match.js';
import './models/Request.js';

// Import routes after models are registered
import blogRoutes from './routes/BlogRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import MatchRoutes from './routes/MatchRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', MatchRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
