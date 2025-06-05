import express from 'express';
import cors from 'cors';
import connectDB from './config/mongo.js';
import userRoutes from './routes/UserRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import locationRoutes from './routes/LocationRoutes.js';
// Socket.io
import { initializeSocket } from './config/socket.js';
import { createServer } from 'http';

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
import './models/Chat.js';
import './models/Message.js';

// Import routes
import reviewRoutes from './routes/ReviewRoutes.js';
import chatRoutes from './routes/ChatRoutes.js';
import messageRoutes from './routes/MessageRoutes.js';

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB();

//Parse user request -> Json format
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Start server
const PORT = process.env.PORT || 3000;

// Initialize socket.io
const io = initializeSocket(httpServer);

// Start listening
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export app and io
export default app;
