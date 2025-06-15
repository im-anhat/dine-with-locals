import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Request from '../models/Request.js';
import Blog from '../models/Blog.js';
import Location from '../models/Location.js';
import connectDB from '../config/mongo.js';
import { SALT } from './constants.js';
import { geocodeLocation } from '../services/LocationService.js';

dotenv.config();

// Arrays for realistic data generation
const regions = {
  NewYork: {
    latRange: [40.716063, 40.819469],
    lngRange: [-74.003018, -73.95998],
  },
  Chicago: {
    latRange: [41.688768, 42.099128],
    lngRange: [-88.118976, -87.634072],
  },
  LA: {
    latRange: [33.774965, 34.179243],
    lngRange: [-118.47221, -117.866589],
  },
};
const hobbies = [
  'Cooking',
  'Traveling',
  'Reading',
  'Photography',
  'Hiking',
  'Yoga',
  'Dancing',
  'Swimming',
  'Cycling',
  'Gaming',
  'Painting',
  'Music',
  'Gardening',
  'Writing',
  'Fitness',
  'Movies',
  'Theater',
  'Art',
  'Science',
  'Technology',
  'Politics',
  'History',
  'Philosophy',
  'Sports',
];

const ethnicities = ['Asian', 'Black', 'Hispanic', 'White', 'Other'];
const roles = ['Host', 'Guest'];
const cuisines = [
  'Italian',
  'Chinese',
  'Thai',
  'Indian',
  'Mexican',
  'Japanese',
  'French',
  'Mediterranean',
  'Korean',
  'Vietnamese',
  'Greek',
  'Spanish',
  'American',
  'Lebanese',
  'Turkish',
  'Ethiopian',
  'Moroccan',
  'Brazilian',
];

const dietaryRestrictions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Kosher',
  'Halal',
  'Keto',
  'Paleo',
  'Low-Carb',
];

const interestTopics = [
  'Technology',
  'Business',
  'Travel',
  'Food',
  'Culture',
  'Art',
  'Music',
  'Sports',
  'Politics',
  'Science',
  'Health',
  'Fashion',
  'Gaming',
  'Literature',
  'Movies',
  'Photography',
  'Nature',
  'History',
  'Philosophy',
];

const categories = ['dining', 'travel', 'event'];
const locationTypes = ['home', 'res', 'either'];

// Generate random array from source array
const getRandomItems = (sourceArray: string[], min = 1, max = 4): string[] => {
  const count = faker.number.int({ min, max });
  const shuffled = [...sourceArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate locations
const generateLocations = async (count: number) => {
  const locations = [];
  for (let i = 0; i < count; i++) {
    const selectedRegion = faker.helpers.arrayElement([
      'NewYork',
      'Chicago',
      'LA',
    ]);
    const genCoordinates = {
      lat: faker.number.float({
        min: regions[selectedRegion].latRange[0],
        max: regions[selectedRegion].latRange[1],
      }),
      lng: faker.number.float({
        min: regions[selectedRegion].lngRange[0],
        max: regions[selectedRegion].lngRange[1],
      }),
    };
    const locationData = geocodeLocation(genCoordinates);
    const location = new Location({
      address: (await locationData).extractedAddress?.street,
      city: (await locationData).extractedAddress?.city,
      state: (await locationData).extractedAddress?.state,
      country: (await locationData).extractedAddress?.country,
      zipCode: (await locationData).extractedAddress?.zipCode,
      coordinates: {
        lat: (await locationData).lat,
        lng: (await locationData).lng,
      },
    });
    locations.push(location);
  }

  return await Location.insertMany(locations);
};

// Generate users
const generateUsers = async (
  count: number,
  locationIds: mongoose.Types.ObjectId[],
) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const hashedPassword = await bcrypt.hash('password123', SALT);

    const user = new User({
      userName:
        faker.internet.username().toLowerCase() +
        faker.number.int({ min: 1, max: 999 }),
      firstName,
      lastName,
      phone: faker.phone.number({ style: 'national' }),
      password: hashedPassword,
      avatar: faker.image.avatar(),
      cover: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
      // socialLink: faker.internet.url(),
      role: faker.helpers.arrayElement(roles),
      hobbies: getRandomItems(hobbies, 2, 6),
      ethnicity: faker.helpers.arrayElement(ethnicities),
      bio: faker.lorem.paragraph({ min: 2, max: 4 }),
      locationId: faker.helpers.arrayElement(locationIds),
    });
    users.push(user);
  }

  return await User.insertMany(users);
};

// Generate listings
const generateListings = async (
  count: number,
  userIds: mongoose.Types.ObjectId[],
  locationIds: mongoose.Types.ObjectId[],
) => {
  const listings = [];

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    const time = faker.date.future({ years: 1 });
    const imageResUrls = [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1497644083578-611b798c60f3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1488324346298-5ad3d8f96d0d?q=80&w=2458&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1511081692775-05d0f180a065?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1606836576983-8b458e75221d?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1546195643-70f48f9c5b87?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1599343871655-6b107ce7a4a5?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1606066352252-93e4d325787b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ];

    const listing = new Listing({
      userId: faker.helpers.arrayElement(userIds),
      title: faker.lorem.words({ min: 3, max: 8 }),
      description: faker.lorem.paragraphs({ min: 2, max: 4 }),
      images: getRandomItems(imageResUrls, 1, 1),
      category: 'dining',
      locationId: faker.helpers.arrayElement(locationIds),
      additionalInfo: faker.lorem.paragraph(),
      time: faker.date.between({
        from: '2025-07-10T00:00:00.000Z',
        to: '2025-07-30T00:00:00.000Z',
      }),
      duration: faker.number.int({ min: 1, max: 3 }),
      interestTopic: getRandomItems(interestTopics, 1, 5),
      numGuests: faker.number.int({ min: 1, max: 8 }),
      cuisine: getRandomItems(cuisines, 1, 3),
      dietary: getRandomItems(dietaryRestrictions, 0, 2),
      status: 'waiting',
    });
    listings.push(listing);
  }

  return await Listing.insertMany(listings);
};

// Generate requests
const generateRequests = async (
  count: number,
  userIds: mongoose.Types.ObjectId[],
  locationIds: mongoose.Types.ObjectId[],
) => {
  const requests = [];

  for (let i = 0; i < count; i++) {
    const time = faker.date.future({ years: 1 });

    const request = new Request({
      userId: faker.helpers.arrayElement(userIds),
      title: faker.lorem.words({ min: 3, max: 8 }),
      locationType: faker.helpers.arrayElement(locationTypes),
      locationId: faker.helpers.arrayElement(locationIds),
      interestTopic: getRandomItems(interestTopics, 1, 4),
      time: faker.date.between({
        from: '2025-07-10T00:00:00.000Z',
        to: '2025-07-30T00:00:00.000Z',
      }),
      cuisine: getRandomItems(cuisines, 0, 3),
      dietaryRestriction: getRandomItems(dietaryRestrictions, 0, 3),
      numGuests: faker.number.int({ min: 1, max: 6 }),
      additionalInfo: faker.lorem.paragraph(),
      status: 'waiting',
    });
    requests.push(request);
  }

  return await Request.insertMany(requests);
};

// Generate blogs
const generateBlogs = async (
  count: number,
  userIds: mongoose.Types.ObjectId[],
) => {
  const blogs = [];

  const blogTitles = [
    'Amazing Dining Experience in Downtown',
    'Cultural Exchange Over Dinner',
    'Discovering Local Flavors',
    'Unforgettable Evening with New Friends',
    'Traditional Cooking Class Adventure',
    'Food Tour with Local Expert',
    'Rooftop Dinner Under the Stars',
    'Home-cooked Meal Experience',
    'Fusion Cuisine Discovery',
    'Community Dining Experience',
  ];

  const imageUrls = [
    'https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?q=80&w=3115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=3276&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1447078806655-40579c2520d6?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1550367363-ea12860cc124?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1502998070258-dc1338445ac2?q=80&w=3079&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1652465485553-37e8a38201f9?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1568376794508-ae52c6ab3929?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1652465485213-eb37cb92a34d?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=3047&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1673580742890-4af144293960?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1652690772837-4f270f7f87a2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1625861910621-e9385ba1d993?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1661600643912-dc6dbb1db475?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];
  for (let i = 0; i < count; i++) {
    const blog = new Blog({
      userId: faker.helpers.arrayElement(userIds),
      blogTitle: faker.helpers.arrayElement(blogTitles),
      blogContent: faker.lorem.paragraphs({ min: 1, max: 4 }),
      photos: getRandomItems(imageUrls, 1, 4),
    });
    blogs.push(blog);
  }

  return await Blog.insertMany(blogs);
};

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    // console.log('Clearing existing data...');
    // await User.deleteMany({});
    // await Listing.deleteMany({});
    // await Request.deleteMany({});
    // await Location.deleteMany({});
    // await Blog.deleteMany({});
    // console.log('Database cleared');

    // Generate locations first (since users, listings, and requests reference them)
    console.log('Generating locations...');
    const locations = await generateLocations(50); // Generate more locations for variety
    const locationIds = locations.map((loc) => loc._id);
    console.log(`${locations.length} locations created`);

    // Generate users
    console.log('Generating users...');
    const users = await generateUsers(100, locationIds);
    const userIds = users.map((user) => user._id);
    console.log(`${users.length} users created`);

    // Generate listings
    console.log('Generating listings...');
    const listings = await generateListings(50, userIds, locationIds);
    console.log(`${listings.length} listings created`);

    // Generate requests
    console.log('Generating requests...');
    const requests = await generateRequests(50, userIds, locationIds);
    console.log(`${requests.length} requests created`);

    // Generate blogs
    console.log('Generating blogs...');
    const blogs = await generateBlogs(10, userIds);
    console.log(`${blogs.length} blogs created`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seed();
