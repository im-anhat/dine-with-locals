import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dine-with-locals');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
export default connectDB;
