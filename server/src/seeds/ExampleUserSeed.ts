import mongoose from 'mongoose';
import User from '../models/ExampleUser';
import connectDB from '../config/mongo';

const seedUsers = async () => {
  await connectDB();

  const users = [
    { name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
  ];

  try {
    await User.deleteMany();
    await User.insertMany(users);
    console.log('User seed data inserted');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();
