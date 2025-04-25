import express from 'express';
import connectDB from './config/mongo.js';
import userRoutes from './routes/ExampleUserRoutes.js';
import authRoutes from './routes/AuthRoutes.js';

const app = express();

connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
