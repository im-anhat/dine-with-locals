// Seed script to add a test blog post
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import connectDB from '../config/mongo.js';

// Connect to MongoDB
connectDB();

// User ID from your mock user in UserContext.tsx
const userId = '67f7f8281260844f9625ee33'; // This should match your currentUser._id

// Test blog data
const testBlog = {
  userId: userId,
  blogTitle: 'My First Blog Post',
  blogContent:
    'This is a test blog post created by the seed script. I had an amazing dining experience with a local host in Denver!',
  photos: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
  ],
};

const seedBlog = async () => {
  try {
    await Blog.create(testBlog);
    console.log('Test blog created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test blog:', error);
    process.exit(1);
  }
};

seedBlog();
