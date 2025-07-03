import express from 'express';
import cors from 'cors';
import authRoutes from '../../routes/AuthRoutes.js';
// Import models to ensure they're registered
import '../../models/User.js';
// Create test app without socket.io and other complex dependencies
const createTestApp = () => {
    const app = express();
    // Middleware
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }));
    // Routes
    app.use('/api/auth', authRoutes);
    return app;
};
export default createTestApp;
