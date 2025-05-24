import express from 'express';
import cors from 'cors';
import connectDB from './config/mongo.js';
import userRoutes from './routes/UserRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import locationRoutes from './routes/LocationRoutes.js';
import filterRoutes from './routes/FilterRoutes.js';

// Import all models first to ensure they're registered with mongoose
import './models/User.js';
import './models/Blog.js';
import './models/Comment.js';
import './models/Like.js';
import './models/Listing.js';
import './models/Location.js';
import './models/Match.js';
import './models/Request.js';
import './models/Review.js';

// Import routes
import reviewRoutes from './routes/ReviewRoutes.js';

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
app.use('/api/filter', filterRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
