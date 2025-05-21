import express from 'express';
import connectDB from './config/mongo.js';
import cors from 'cors';
// import userRoutes from './routes/ExampleUserRoutes.js';
import errorHandler from './middlewares/ExampleErrorHandler.js';
import uploadRoutes from './routes/uploadRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cors())

// Routes
// app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/locations', locationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;