import connectDB from '../config/mongo.js';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Request from '../models/Request.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import Match from '../models/Match.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Blog.deleteMany({}),
      Request.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Match.deleteMany({}),
    ]);

    // Create dummy Users
    const users = await User.insertMany([
      {
        userName: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        password: 'password123', // Will be hashed by pre-save hook
        avatar: '',
        socialLink: '',
        role: 'Host',
        hobbies: ['cooking'],
        ethnicity: 'Caucasian',
        bio: 'Hello, I am John!',
      },
      {
        userName: 'jane_smith',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '0987654321',
        password: 'password456', // Will be hashed by pre-save hook
        avatar: '',
        socialLink: '',
        role: 'Guest',
        hobbies: ['reading'],
        ethnicity: 'Asian',
        bio: 'Hello, I am Jane!',
      },
    ]);
    console.log(
      'Seeded Users:',
      users.map((u) => u.userId),
    );

    // Create a dummy Blog by john_doe (use May 1, 2025 for createdAt)
    const blog = await Blog.create({
      userId: users[0].userId,
      blogTitle: 'My First Blog',
      blogContent: 'This is the content of my first blog post.',
      photos: [],
      createdAt: new Date('2025-05-01'),
    });
    console.log('Seeded Blog with blogId:', blog.blogId);

    // Create a dummy Request by jane_smith (using May 2, 2025)
    const request = await Request.create({
      userId: users[1].userId,
      title: 'Dinner Request',
      locationType: 'home',
      location: 'New York',
      interestTopic: 'Italian Cuisine',
      time: new Date('2025-05-02'),
      cuisine: ['Italian', 'Mediterranean'],
      dietaryRestriction: ['Vegetarian'],
      numGuests: 2,
      additionalInfo: 'Looking forward to a great dinner!',
      status: 'pending',
      createdAt: new Date('2025-05-02'),
    });
    console.log('Seeded Request with requestId:', request.requestId);

    // Create a dummy Comment on the Blog by jane_smith (using May 3, 2025)
    const comment = await Comment.create({
      blogId: blog.blogId,
      userId: users[1].userId,
      content: 'Great blog post!',
      createdAt: new Date('2025-05-03'),
    });
    console.log('Seeded Comment with commentId:', comment.commentId);

    // Create a Like record (jane_smith likes the Blog)
    const like = await Like.create({
      userId: users[1].userId,
      // Assuming your Blog.blogId is a number, cast it to string if your schema expects string:
      blogId: String(blog.blogId),
      createdAt: new Date('2025-05-03'),
    });
    console.log('Seeded Like');

    // Create a Match record between john_doe (as host) and jane_smith (as guest)
    const match = await Match.create({
      hostId: users[0].userId,
      guestId: users[1].userId,
      // Optionally, if there's a listingID or reqID, assign here. For now, we'll leave listingID undefined.
      reqID: request.requestId,
      status: 'pending',
      time: new Date('2025-05-03'),
    });
    console.log('Seeded Match');

    console.log('Dummy data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
