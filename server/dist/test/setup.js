/**
 * Test setup file for Jest
 * This file is run before all tests to set up the testing environment
 */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
// Load test environment variables
dotenv.config({ path: '.env.test' });
// Set test environment
process.env.NODE_ENV = 'test';
let mongod;
/**
 * Connect to the in-memory database before running tests
 */
beforeAll(async () => {
    // Only create a new connection if we don't have one
    if (mongoose.connection.readyState === 0) {
        // Create an in-memory MongoDB instance
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        // Connect mongoose to the in-memory database
        await mongoose.connect(uri);
    }
});
/**
 * Clear all test data after every test
 */
afterEach(async () => {
    const collections = mongoose.connection.collections;
    // Clear all collections
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
/**
 * Remove and close the database and server after all tests
 */
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
        await mongod.stop();
    }
});
// Mock console.log to reduce noise during tests
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
// Increase timeout for database operations
jest.setTimeout(30000);
export {};
