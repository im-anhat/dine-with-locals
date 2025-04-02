import express from 'express';
import connectDB from './config/mongo';
import userRoutes from './routes/ExampleUserRoutes';
import errorHandler from './middlewares/ExampleErrorHandler';

// Our team can write code here.
const app = express();

// BELOW IS EXAMPLE ONLY ;)

// const app = express();

// connectDB();

// app.use(express.json());
// app.use('/api/users', userRoutes);
// app.use(errorHandler);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
