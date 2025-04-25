import express from 'express';
import connectDB from './config/mongo.js';
import blogRoutes from './routes/BlogRoutes.js';
import cors from 'cors';
import './models/User.js';
import './models/User.js';
import './models/Blog.js';
import './models/Comment.js';
import './models/Like.js';
import './models/Listing.js';
import './models/Location.js';
import './models/Match.js';
import './models/Request.js';

// Import routes after models are registered

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
