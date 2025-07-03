import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Request from '../models/Request.js';
import connectDB from '../config/mongo.js';
import Location from '../models/Location.js';
import Match from '../models/Match.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import Review from '../models/Review.js';
dotenv.config();
async function seed() {
    try {
        await connectDB();
        // Clear existing data
        await User.deleteMany({});
        await Listing.deleteMany({});
        await Request.deleteMany({});
        await Location.deleteMany({});
        await Match.deleteMany({});
        await Blog.deleteMany({});
        await Comment.deleteMany({});
        await Like.deleteMany({});
        await Review.deleteMany({});
        console.log('Database cleared');
        // Create sample users
        const user1 = new User({
            userName: 'im-anhat',
            firstName: 'Nhat',
            lastName: 'Le',
            phone: '5158154578',
            password: 'dummypw',
            avatar: 'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
            socialLink: 'https://www.linkedin.com/in/chris-le05/',
            role: 'Host',
            hobbies: ['Cooking', 'Traveling', 'Science', 'Politics'],
            ethnicity: 'Asian',
            bio: 'I am a software engineer with a passion for artificial intelligence.',
        });
        const user2 = new User({
            userName: 'bsi-quy',
            firstName: 'Quy',
            lastName: 'Nguyen',
            phone: '7201234567',
            password: 'dummypw',
            avatar: 'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
            socialLink: 'https://www.linkedin.com/in/quy-duong-nguyen/',
            role: 'Guest',
            hobbies: ['Cooking', 'Traveling', 'Science', 'Politics'],
            ethnicity: 'Asian',
            bio: 'I am a software engineer.',
        });
        // Save users to the database
        await user1.save();
        await user2.save();
        console.log('Users seeded');
        // Create sample locations
        const locationNY = new Location({
            city: 'New York',
            country: 'USA',
        });
        await locationNY.save();
        const locationChicago = new Location({
            city: 'Chicago',
            country: 'USA',
        });
        await locationChicago.save();
        console.log('Locations seeded');
        // Create sample listings
        const listing1 = new Listing({
            userId: user1._id, // now referencing _id
            title: 'Cozy New York Apartment',
            locationType: 'res',
            locationId: locationNY._id, // referencing the New York location
            interestTopic: ['Football', 'Politics', 'Culture', 'Travel'],
            time: new Date('2025-06-01T19:00:00Z'),
            cuisine: ['Italian'],
            dietary: ['Vegan'],
            numGuests: 3,
            additionalInfo: 'Great space for intimate gatherings.',
            status: 'waiting',
        });
        const listing2 = new Listing({
            userId: user1._id,
            title: 'Spicy and Sour Pad Thai',
            locationType: 'home',
            locationId: locationNY._id,
            interestTopic: ['Gaming', 'Politics', 'Science', 'Culture', 'Travel'],
            time: new Date('2025-06-01T19:00:00Z'),
            cuisine: ['Thai', 'Asian'],
            dietary: ['Vegan'],
            numGuests: 3,
            additionalInfo: 'Great space for intimate gatherings.',
            status: 'approved',
        });
        await listing1.save();
        await listing2.save();
        console.log('Listings seeded');
        // Create sample requests
        const request1 = new Request({
            userId: user2._id,
            title: 'Networking at Chicago',
            locationType: 'res',
            locationId: locationChicago._id,
            interestTopic: ['Computer Science', 'Politics', 'Culture', 'Travel'],
            time: new Date('2025-05-01T19:00:00Z'),
            cuisine: [],
            dietaryRestriction: ['Vegetarian'],
            numGuests: 2,
            additionalInfo: 'Looking for a casual dinner meeting. Hoping to meet new people and enjoy local food.',
            status: 'waiting',
        });
        await request1.save();
        console.log('Request seeded');
        // Create sample matches
        const match1 = new Match({
            hostId: user1._id,
            guestId: user2._id,
            listingId: listing2._id,
            status: 'approved',
            time: listing2.time,
        });
        await match1.save();
        console.log('Match seeded');
        // Seed a blog about the experience that user2 had with user1 for listing2
        const blog1 = new Blog({
            userId: user2._id,
            blogTitle: 'Fantastic Experience at Spicy and Sour Pad Thai',
            blogContent: 'I had a great dining experience hosted by im-anhat at the Spicy and Sour Pad Thai listing. The food and ambiance were exceptional!',
            photos: [
                'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=600,height=400,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/fa1a6192-4d67-4396-b852-e0421c5f8df3.jpg',
            ],
        });
        await blog1.save();
        console.log('Blog seeded');
        // Seed comments for the blog
        const comment1 = new Comment({
            blogId: blog1._id,
            userId: user1._id,
            content: 'Thank you for sharing your experience!',
        });
        await comment1.save();
        const comment2 = new Comment({
            blogId: blog1._id,
            userId: user2._id,
            content: 'I totally agree, it was fantastic!',
        });
        await comment2.save();
        console.log('Comments seeded');
        // Seed likes for the blog
        const like1 = new Like({
            blogId: blog1._id,
            userId: user1._id,
        });
        await like1.save();
        const like2 = new Like({
            blogId: blog1._id,
            userId: user2._id,
        });
        await like2.save();
        console.log('Likes seeded');
        // Seed reviews
        const review1 = new Review({
            userId: new mongoose.Types.ObjectId('67f7f8281260844f9625ee32'), // Review for Nhat (Host)
            reviewerId: new mongoose.Types.ObjectId('67f7f8281260844f9625ee33'), // Written by Quy (Guest)
            rating: 5,
            content: 'Nhat was an exceptional host! The Thai food was amazing and the conversation was engaging. Would definitely recommend dining with him!',
        });
        await review1.save();
        const review2 = new Review({
            userId: new mongoose.Types.ObjectId('67f7f8281260844f9625ee33'), // Review for Quy (Guest)
            reviewerId: new mongoose.Types.ObjectId('67f7f8281260844f9625ee32'), // Written by Nhat (Host)
            rating: 4,
            content: 'Quy was a great guest, arrived on time and brought interesting conversation topics. Looking forward to hosting him again.',
        });
        await review2.save();
        console.log('Reviews seeded');
        // DONE
        console.log('Database seeded successfully');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        mongoose.connection.close();
    }
}
seed();
