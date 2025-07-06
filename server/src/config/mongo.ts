import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // In test environment, don't connect to external MongoDB
    if (process.env.NODE_ENV === 'test') {
      // mongodb-memory-server handles the connection in tests
      console.log(
        'Test environment: Skipping MongoDB connection (handled by test setup)',
      );
      return;
    }

    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/dine-with-locals',
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

export default connectDB;
